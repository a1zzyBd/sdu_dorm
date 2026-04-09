import React from 'react';
import { Gallery } from './Gallery';

export const GallerySection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <Gallery />
    </section>
  );
};