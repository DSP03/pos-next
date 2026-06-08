import Layout from "@/components/common/Layout";

const Home = () => {
  return (
    <Layout>
      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg min-h-[300px]">
        <h1 className="text-5xl font-bold text-slate-800 mb-4">
          Welcome
        </h1>

        <p className="text-slate-600 text-lg leading-relaxed">
          Select a module from the sidebar to continue managing your application.
        </p>
      </div>
    </Layout>
  );
};

export default Home;