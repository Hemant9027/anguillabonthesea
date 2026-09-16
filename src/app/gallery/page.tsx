import type { Metadata } from 'next';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GalleryClient from '../../components/GalleryClient';
import { listGalleryItems } from '@/lib/db/services/galleryService';
import { GALLERY_SECTIONS } from '@/lib/types/gallery';

export const dynamic = 'force-dynamic';

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

async function getLiveGallerySections(): Promise<Section[]> {
  try {
    const dbItems = await listGalleryItems({ status: 'active' });
    if (!dbItems || dbItems.length === 0) {
      return [];
    }

    const sections: Section[] = GALLERY_SECTIONS.map((conf) => {
      const secImages = dbItems
        .filter((item) => item.section === conf.key)
        .sort((a, b) => a.order - b.order)
        .map((item) => item.url);

      return {
        key: conf.key,
        label: conf.label,
        images: secImages,
      };
    }).filter((sec) => sec.images.length > 0);

    return sections;
  } catch (err) {
    console.warn('Failed to load gallery from DB:', err);
    return [];
  }
}

function getHeroImage(sections: Section[]): string | null {
  for (const section of sections) {
    if (section.images && section.images.length > 0) {
      return section.images[0];
    }
  }
  return null;
}

export default async function GalleryPage() {
  const sections = await getLiveGallerySections();
  const hero = getHeroImage(sections);

  return (
    <>
      <Header />
      <GalleryClient sections={sections} hero={hero} />
      <Footer />
    </>
  );
}
