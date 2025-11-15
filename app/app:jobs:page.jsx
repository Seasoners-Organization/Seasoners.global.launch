import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function JobsPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-sky-900 mb-4">Seasonal Jobs</h1>
        <p className="text-slate-700 mb-8">
          Hospitality, mountain ops, retail, trades and more. Direct contact with employers.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="font-semibold">Sample Job #{i}</div>
              <div className="text-sm text-slate-500 mt-1">Barista • Dec–Mar • Innsbruck</div>
              <a href="/list" className="mt-4 inline-block text-sky-700 hover:underline">List a role →</a>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
