/**
 * Central business data (NAP, contact, service areas, integrations).
 * These are the values that appear in the header, footer, structured data,
 * and contact page. Update here to change site-wide.
 */

export interface ServiceArea {
  city: string;
  state: 'SC' | 'NC';
  slug: string;
  /** Short blurb used on the city landing page. */
  blurb: string;
}

export const site = {
  name: 'Candor Concrete',
  legalName: 'Candor Concrete Company LLC',
  tagline: 'Built on Honesty. Focused on Quality.',
  description:
    'Candor Concrete delivers durable, high-quality residential concrete in Greenville, SC and the Upstate. Driveways, patios, foundations, stamped concrete & overlays — built on honesty, focused on quality.',

  /**
   * Home-page hero background image. Drop a photo in the /public folder and set
   * its path here, e.g. '/hero.jpg'. Leave blank to use the dark gradient only.
   * Best results: a landscape photo ~2000px wide, saved as a compressed JPG.
   */
  heroImage: '/hero.jpg' as string,

  // Contact / NAP — keep consistent everywhere for local SEO.
  phone: '(864) 914-9200',
  phoneHref: 'tel:+18649149200',
  email: 'Info@candorcrete.com',
  emailHref: 'mailto:Info@candorcrete.com',

  address: {
    // Optional public street address. Fill in to strengthen local SEO and match
    // your Google Business Profile. Leave '' for a home-based / service-area-only
    // business (the schema then omits streetAddress but keeps city + areaServed).
    street: '' as string,
    city: 'Greenville',
    region: 'SC',
    postalCode: '29690',
    country: 'US',
  },
  // Approximate coordinates for Greenville, SC (used in LocalBusiness schema).
  geo: { latitude: 34.8526, longitude: -82.394 },

  // Business hours — CONFIRM with client before launch. Used in schema + footer.
  hours: [
    { days: 'Monday – Friday', open: '07:00', close: '17:00' },
    { days: 'Saturday', open: '08:00', close: '14:00' },
  ],

  social: {
    instagram: 'https://www.instagram.com/candorconcrete',
    facebook: 'https://www.facebook.com/',
  },

  /**
   * Featurable Google-reviews widget ID. Create a free widget at
   * https://featurable.com, connect the Google Business Profile, and paste the
   * widget ID here. Reviews then auto-sync daily with no further code changes.
   */
  featurableWidgetId: '' as string,

  /**
   * Formspree form ID for the estimate form. Create a free form at
   * https://formspree.io targeting Info@candorcrete.com and paste its ID
   * (the part after /f/ in the endpoint) here.
   */
  formspreeId: 'xbdndkgr' as string,
} as const;

export const serviceAreas: ServiceArea[] = [
  {
    city: 'Greenville',
    state: 'SC',
    slug: 'greenville-sc',
    blurb:
      'Our home base. Full-service residential concrete across Greenville and its neighborhoods.',
  },
  {
    city: 'Travelers Rest',
    state: 'SC',
    slug: 'travelers-rest-sc',
    blurb:
      'Driveways, patios and foundations for Travelers Rest homeowners north of Greenville.',
  },
  {
    city: 'Easley',
    state: 'SC',
    slug: 'easley-sc',
    blurb: 'Quality concrete work for Easley and the surrounding Pickens County area.',
  },
  {
    city: 'Greer',
    state: 'SC',
    slug: 'greer-sc',
    blurb: 'Serving Greer with dependable driveways, patios, and stamped concrete.',
  },
  {
    city: 'Spartanburg',
    state: 'SC',
    slug: 'spartanburg-sc',
    blurb: 'Residential concrete services throughout the Spartanburg area.',
  },
  {
    city: 'Simpsonville',
    state: 'SC',
    slug: 'simpsonville-sc',
    blurb: 'Trusted concrete contractor for Simpsonville and the Golden Strip.',
  },
  {
    city: 'Asheville',
    state: 'NC',
    slug: 'asheville-nc',
    blurb: 'Bringing honest, quality concrete work to the Asheville, NC area.',
  },
  {
    city: 'Hendersonville',
    state: 'NC',
    slug: 'hendersonville-nc',
    blurb: 'Serving Hendersonville, NC with craftsmanship you can trust.',
  },
];

/**
 * Convert a 24-hour "HH:MM" string (used for schema.org data) into a friendly
 * 12-hour label for display, e.g. "07:00" -> "7:00 AM", "17:00" -> "5:00 PM".
 */
export function to12Hour(time24: string): string {
  const [hStr, mStr = '00'] = time24.split(':');
  let hour = parseInt(hStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${mStr} ${period}`;
}

/** Primary navigation links. */
export const mainNav = [
  { label: 'Services', href: '/services/' },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
