/**
 * Generic print utility — pass it a ref to whatever DOM section you want
 * printed. Opens a real print window with just that content, inlining the
 * actual CSS rules already loaded on the page (not re-linking stylesheets)
 * so Tailwind classes render correctly even though the print window has no
 * real URL to resolve relative paths against.
 *
 * Usage in any page/component:
 *   const printRef = useRef(null);
 *   <div ref={printRef}>...content to print...</div>
 *   <button onClick={() => printElement(printRef, { title: "Invoice #123" })}>
 *     Print
 *   </button>
 */
export function printElement(ref, options = {}) {
  if (!ref?.current) {
    console.error("printElement: ref is empty — make sure it's attached before calling.");
    return;
  }

  const { title = "Print", onAfterPrint } = options;

  const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (!printWindow) {
    alert("Please allow popups for this site to print.");
    return;
  }

  // Read every loaded stylesheet's actual CSS rules and inline them as text,
  // instead of cloning <link> tags. Next.js emits Tailwind's compiled CSS
  // via a relative path (e.g. "/_next/static/css/xxx.css") — a cloned <link>
  // has to re-fetch that file, but a blank window opened via window.open("")
  // has no real URL, so relative paths can't resolve and the file silently
  // fails to load. Inlining the CSS that's already loaded in memory sidesteps
  // that entirely.
  let css = "";
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        css += rule.cssText + "\n";
      }
    } catch {
      // Cross-origin sheets (e.g. Google Fonts) throw when reading cssRules
      // due to CORS — fall back to re-linking those specifically by their
      // absolute href, which still resolves fine.
      if (sheet.href) {
        css += `@import url("${sheet.href}");\n`;
      }
    }
  }

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <base href="${window.location.origin}/">
        <title>${title}</title>
        <style>${css}</style>
        <style>
          @media print { body { margin: 0; } }
          body { font-family: inherit; background: white; padding: 24px; }
        </style>
      </head>
      <body>${ref.current.outerHTML}</body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  let printed = false;
  const triggerPrint = () => {
    if (printed) return; // guard against onload + fallback both firing
    printed = true;
    printWindow.focus();
    printWindow.print();
  };

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    if (!printWindow.closed) printWindow.close();
    onAfterPrint?.();
  };

  // The `load` event's timing is unreliable for windows built via
  // document.write() — sometimes it's already fired by the time we attach
  // the listener, sometimes it fires again after write(). So check directly
  // first, and only fall back to the event (plus a hard timeout) as
  // safety nets, never relying on just one path.
  if (printWindow.document.readyState === "complete") {
    triggerPrint();
  } else {
    printWindow.onload = triggerPrint;
    setTimeout(triggerPrint, 500); // safety net if onload never fires
  }

  printWindow.onafterprint = cleanup;
  setTimeout(cleanup, 60000); // safety net if afterprint never fires
}