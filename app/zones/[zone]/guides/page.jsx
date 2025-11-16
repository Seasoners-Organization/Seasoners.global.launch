import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { getZoneBySlug } from '../../../../data/zones';

export default function ZoneGuides({ params }) {
  const { zone } = params;
  const zoneData = getZoneBySlug(zone);

  return (
    <main>
      <Navbar />
      <section className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Guides for {zoneData ? zoneData.title : zone}</h1>
        <p className="mb-4 text-slate-700">Guides and blog posts will be listed here.</p>
        <div className="rounded-lg border p-4 bg-white/80">Placeholder for guides list</div>
      </section>
      <Footer />
    </main>
  );
}
