import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function StaysPage() {
  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-sky-900 mb-4">Short-Term Stays</h1>
        <p className="text-slate-700 mb-8">
          Find furnished & unfurnished short-term rentals. Innsbruck pilot first — global next.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border rounded-2xl p-5 shadow-sm">
              <div className="font-semibold">Sample Stay #{i}</div>
              <div className="text-sm text-slate-500 mt-1">€1,100/mo • 3–6 months • Innsbruck</div>
              <a href="/agreement" className="mt-4 inline-block text-sky-700 hover:underline">Use Smart Stay Agreement →</a>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
