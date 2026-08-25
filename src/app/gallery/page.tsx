import fs from 'fs';
import path from 'path';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GalleryClient from '../../components/GalleryClient';

export const metadata = {
  title: 'Gallery — B on the Sea',
};

function humanLabel(folder: string) {
  const map: Record<string, string> = {
    '1': 'Villa',
    bedrooms: 'Bedrooms',
    mainlevel: 'Main Level',
    entertainmentdeck: 'Entertainment Deck',
    viewmainlevel: 'Main Level Views',
    viewupperlevel: 'Upper Level Views',
    amenities: 'Amenities',
    gallery: 'Gallery',
  };
  return map[folder] ?? folder.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function GalleryPage() {
  const base = path.join(process.cwd(), 'public', 'uploads');
  const aboutDir = path.join(base, 'aboutvillab');
  let sections: { key: string; label: string; images: string[] }[] = [];

  try {
    const folders = fs
      .readdirSync(aboutDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    for (const f of folders) {
      const folderPath = path.join(aboutDir, f);
      const files = fs.readdirSync(folderPath).filter((fn) => /\.(jpe?g|png|webp|gif)$/i.test(fn));
      if (files.length > 0) {
        const images = files.map((fn) => `/uploads/aboutvillab/${f}/${fn}`);
        sections.push({ key: f, label: humanLabel(f), images });
      }
    }
  } catch (e) {
    sections = [];
  }

  // Also include top-level galleryphotos if present
  try {
    const gp = path.join(base, 'galleryphotos');
    if (fs.existsSync(gp)) {
      const folders = fs.readdirSync(gp);
      const images: string[] = [];
      for (const item of folders) {
        const itemPath = path.join(gp, item);
        const stat = fs.statSync(itemPath);
        if (stat.isFile() && /\.(jpe?g|png|webp|gif)$/i.test(item))
          images.push(`/uploads/galleryphotos/${item}`);
      }
      if (images.length > 0) sections.unshift({ key: 'galleryphotos', label: 'Villa', images });
    }
  } catch (e) {
    // ignore
  }

  // Choose hero image: prefer galleryphotos, then '1', then mainlevel, then bedrooms
  let hero: string | null = null;
  const prefer = ['galleryphotos', '1', 'mainlevel', 'bedrooms'];
  for (const p of prefer) {
    const s = sections.find((x) => x.key === p);
    if (s && s.images.length > 0) {
      hero = s.images[0];
      break;
    }
  }
  if (!hero && sections.length > 0) hero = sections[0].images[0];

  return (
    <>
      <Header />
      <GalleryClient sections={sections} hero={hero} />
      <Footer />
    </>
  );
}
