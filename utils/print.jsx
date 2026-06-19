/**
 * Generic print utility — pass it a ref to whatever DOM section you want
 * printed, and it opens a clean print window with just that content,
 * using your app's existing stylesheets so Tailwind classes still apply.
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

  // Pull in every stylesheet/style tag from the current document so
  // Tailwind utility classes render correctly inside the print window too.
  const styleTags = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((node) => node.outerHTML)
    .join("\n");

  printWindow.document.open();
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        ${styleTags}
        <style>
          @media print {
            body { margin: 0; }
          }
          body {
            font-family: inherit;
            background: white;
            padding: 24px;
          }
        </style>
      </head>
      <body>
        ${ref.current.outerHTML}
      </body>
    </html>
  `);
  printWindow.document.close();

  // Wait for stylesheets/images to finish loading before triggering print,
  // otherwise the print window can render unstyled.
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    onAfterPrint?.();
  };
}