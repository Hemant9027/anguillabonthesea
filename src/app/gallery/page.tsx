import fs from 'fs';
import path from 'path';

import type { Metadata } from 'next';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GalleryClient from '../../components/GalleryClient';

export const metadata: Metadata = {
  title: 'Gallery — B on the Sea',
  description:
    'Explore B on the Sea through photographs of the villa, bedrooms, decks, views, amenities, and Caribbean surroundings.',
};

type Section = {
  key: string;
  label: string;
  images: string[];
};

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif)$/i;

const SECTION_ORDER = [
  'galleryphotos',
  '1',
  'mainlevel',
  'bedrooms',
  'entertainmentdeck',
  'viewmainlevel',
  'viewupperlevel',
  'amenities',
];

const LABELS: Record<string, string> = {
  '1': 'Villa',
  bedrooms: 'Bedrooms',
  mainlevel: 'Main Level',
  entertainmentdeck: 'Entertainment Deck',
  viewmainlevel: 'Main Level Views',
  viewupperlevel: 'Upper Level Views',
  amenities: 'Amenities',
  gallery: 'Gallery',
  galleryphotos: 'Villa',
};

function humanLabel(folder: string) {
  return (
    LABELS[folder.toLowerCase()] ??
    folder.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function sortFiles(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

function readImagesFromDirectory(directory: string, publicPrefix: string): string[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.test(entry.name))
    .map((entry) => `${publicPrefix}/${encodeURIComponent(entry.name)}`)
    .sort(sortFiles);
}

function readGallerySections(): Section[] {
  const base = path.join(process.cwd(), 'public', 'uploads');
  const sections: Section[] = [];

  /*
   * aboutvillab
   */
  const aboutVillaDir = path.join(base, 'aboutvillab');

  if (fs.existsSync(aboutVillaDir)) {
    const folders = fs
      .readdirSync(aboutVillaDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort((a, b) => {
        const aIndex = SECTION_ORDER.indexOf(a);
        const bIndex = SECTION_ORDER.indexOf(b);

        if (aIndex === -1 && bIndex === -1) {
          return a.localeCompare(b);
        }

        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
      });

    for (const folder of folders) {
      const folderPath = path.join(aboutVillaDir, folder);

      const images = readImagesFromDirectory(
        folderPath,
        `/uploads/aboutvillab/${encodeURIComponent(folder)}`
      );

      if (images.length > 0) {
        sections.push({
          key: folder,
          label: humanLabel(folder),
          images,
        });
      }
    }
  }

  /*
   * galleryphotos
   *
   * These images become the first "Villa" collection.
   */
  const galleryPhotosDir = path.join(base, 'galleryphotos');

  const galleryPhotos = readImagesFromDirectory(galleryPhotosDir, '/uploads/galleryphotos');

  if (galleryPhotos.length > 0) {
    sections.unshift({
      key: 'galleryphotos',
      label: 'Villa',
      images: galleryPhotos,
    });
  }

  return sections;
}

function getHeroImage(sections: Section[]) {
  const preferred = ['galleryphotos', '1', 'mainlevel', 'bedrooms'];

  for (const key of preferred) {
    const section = sections.find((item) => item.key === key);

    if (section?.images[0]) {
      return section.images[0];
    }
  }

  return sections[0]?.images[0] ?? null;
}

export default function GalleryPage() {
  const sections = readGallerySections();
  const hero = getHeroImage(sections);

  return (
    <>
      <Header />

      <GalleryClient sections={sections} hero={hero} />

      <Footer />
    </>
  );
}
