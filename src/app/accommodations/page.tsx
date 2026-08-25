import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import AccommodationsGalleryClient from '../../components/AccommodationsGalleryClient';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'Accommodations — Villa Bedrooms',
};

export default function AccommodationsPage() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'aboutvillab', 'bedrooms');
  let files: string[] = [];
  try {
    files = fs.readdirSync(uploadsDir).filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));
  } catch (e) {
    // If folder unreadable, leave files empty to avoid crashing
    files = [];
  }

  const images = files.map((f) => `/uploads/aboutvillab/bedrooms/${f}`);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="max-w-3xl mx-auto text-center mb-10">
          <p className="text-sm tracking-widest text-slate-500">ACCOMMODATIONS</p>
          <h1 className="mt-3 text-4xl font-display">Villa Bedrooms</h1>
          <p className="mt-3 text-slate-600">
            Private spaces designed for comfort, privacy, and views of the Caribbean.
          </p>
        </header>

        <AccommodationsGalleryClient images={images} />

        <section className="mt-12 text-center">
          <h2 className="text-2xl font-display mb-4">Experience B on the Sea</h2>
          <a
            href="/book-now"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-md hover:opacity-90 transition"
          >
            Book Your Stay
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
