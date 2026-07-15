import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Service pages (editable via the CMS). Body markdown becomes the long-form copy.
 */
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    // Short label used in nav/cards; defaults to title if omitted.
    shortTitle: z.string().optional(),
    order: z.number().default(0),
    summary: z.string(),
    // Optional hero image path under /public/uploads (managed by the CMS).
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    features: z.array(z.string()).default([]),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    // SEO overrides (fall back to title/summary when blank).
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Written testimonials (editable via the CMS). Google reviews are handled
 * separately by the Featurable widget on the Reviews page.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),
    location: z.string().optional(),
    rating: z.number().min(1).max(5).default(5),
    quote: z.string(),
    date: z.coerce.date().optional(),
    featured: z.boolean().default(false),
  }),
});

/**
 * Project gallery photos (editable via the CMS). Images live in /public/uploads.
 */
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: z.object({
    title: z.string(),
    image: z.string(),
    alt: z.string(),
    category: z
      .enum([
        'Driveways',
        'Patios',
        'Foundations',
        'Stamped Concrete',
        'Overlays',
        'Commercial',
        'Other',
      ])
      .default('Other'),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { services, testimonials, gallery };
