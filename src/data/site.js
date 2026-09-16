// ---------------------------------------------------------------
// All editable site content lives here.
// To change text, phone number, address or default images, edit this
// file only. Client-uploaded photos are handled by the Admin page.
// ---------------------------------------------------------------

export const studio = {
  name: 'The Cameo Studio',
  short: 'cameostudio',
  tagline: 'Echoes of Light & Time',
  phoneDisplay: '97135-07135',
  phoneRaw: '919713507135',
  whatsapp: 'https://wa.me/919713507135',
  email: '', // add when available
  address: 'Shop No 1, Patwari Ka Bagh, Achheja, Dadri, Uttar Pradesh 203207',
  serviceAreas: ['Delhi', 'Noida', 'Greater Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'],
  social: {
    instagram: 'https://www.instagram.com/thecameostudio_/',
    youtube: 'https://www.youtube.com/@thecameostudio',
    facebook: 'https://www.facebook.com/TheCameostudio',
  },
  // Admin passcode. Change this before going live.
  adminPasscode: 'cameo2026',
}

// Default images.
// The old Google Sites URLs cannot be loaded from another domain, so these
// are temporary placeholder photos. Put the client's real photos in
// /public/images/ and reference them like '/images/wedding-1.jpg'.
const ph = (seed, w = 900, h = 1125) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const IMG = {
  preWedding: ph('cameo-prewedding'),
  wedding: ph('cameo-wedding'),
  maternity: ph('cameo-maternity'),
  food: ph('cameo-food', 900, 900),
  product: ph('cameo-product', 900, 900),
  clothing: ph('cameo-clothing'),
  baby: ph('cameo-baby'),
  birthday: ph('cameo-birthday', 900, 700),
}

// Order here = order on the site.
export const categories = [
  {
    slug: 'pre-wedding',
    name: 'Pre Wedding',
    group: 'People',
    blurb: 'Two people, one afternoon, and the light that belongs only to them.',
    cover: IMG.preWedding,
    images: [IMG.preWedding, ph('pw2'), ph('pw3', 900, 700), ph('pw4')],
  },
  {
    slug: 'wedding',
    name: 'Wedding Stories',
    group: 'People',
    blurb: 'From haldi to vidaai — the whole story, told in the order it happened.',
    cover: IMG.wedding,
    images: [IMG.wedding, ph('wd2', 900, 700), ph('wd3'), ph('wd4'), ph('wd5', 900, 700)],
  },
  {
    slug: 'maternity',
    name: 'Maternity',
    group: 'People',
    blurb: 'A quiet season, photographed before it passes.',
    cover: IMG.maternity,
    images: [IMG.maternity, ph('mt2'), ph('mt3', 900, 700)],
  },
  {
    slug: 'baby',
    name: 'Baby Shoot',
    group: 'People',
    blurb: 'Newborns from 0 to 3 months, in the softest light we can find.',
    cover: IMG.baby,
    images: [IMG.baby, ph('bb2', 900, 900), ph('bb3')],
  },
  {
    slug: 'pre-birthday',
    name: 'Pre Birthday Baby',
    group: 'People',
    blurb: 'The last few weeks before the first candle.',
    cover: ph('cameo-prebirthday'),
    images: [ph('cameo-prebirthday'), ph('pbb2', 900, 900)],
  },
  {
    slug: 'birthday',
    name: 'Birthday Event',
    group: 'Events',
    blurb: 'Cake, chaos, and the faces around the table.',
    cover: IMG.birthday,
    images: [IMG.birthday, ph('bd2'), ph('bd3', 900, 900)],
  },
  {
    slug: 'corporate',
    name: 'Corporate Event',
    group: 'Events',
    blurb: 'Launches, conferences and team days, covered end to end.',
    cover: ph('cameo-corporate', 900, 700),
    images: [ph('cameo-corporate', 900, 700), ph('cp2'), ph('cp3', 900, 700)],
  },
  {
    slug: 'food',
    name: 'Food',
    group: 'Brands',
    blurb: 'Menus, cafés and cloud kitchens — plated for the camera.',
    cover: IMG.food,
    images: [IMG.food, ph('fd2'), ph('fd3', 900, 700)],
  },
  {
    slug: 'product',
    name: 'Product',
    group: 'Brands',
    blurb: 'Clean catalogue shots and styled scenes for D2C brands.',
    cover: IMG.product,
    images: [IMG.product, ph('pd2'), ph('pd3', 900, 700)],
  },
  {
    slug: 'clothing',
    name: 'Clothing',
    group: 'Brands',
    blurb: 'Lookbooks and catalogues, on model or on ghost mannequin.',
    cover: IMG.clothing,
    images: [IMG.clothing, ph('cl2'), ph('cl3', 900, 900)],
  },
  {
    slug: 'interior',
    name: 'Interior',
    group: 'Brands',
    blurb: 'Homes, cafés and offices, photographed for listings and portfolios.',
    cover: ph('cameo-interior', 900, 700),
    images: [ph('cameo-interior', 900, 700), ph('in2'), ph('in3', 900, 700)],
  },
]


// ---------------------------------------------------------------
// Homepage banner (sits directly under the header).
// Two separate images so the crop is right on each device:
//   desktop — wide, around 1920 x 700
//   mobile  — tall, around 900 x 1100
// Put files in /public/images/ and point to them like
// '/images/banner-desktop.jpg', or upload from /admin > Banner.
// Set `show: false` to hide the banner entirely.
// ---------------------------------------------------------------
export const banner = {
  show: true,
  desktop: ph('cameo-banner-wide', 1920, 700),
  mobile: ph('cameo-banner-tall', 900, 1100),
  alt: 'The Cameo Studio',
  heading: 'Wedding season 2026 is open',
  text: 'Dates for November and December are filling up. Send us your date and we will hold it for 48 hours.',
  ctaLabel: 'Check your date',
  ctaLink: '', // leave empty to use WhatsApp
}

export const about = {
  headline: 'Where moments turn into timeless art',
  body: [
    'Every smile, every glance, every emotion tells a story worth preserving.',
    'At The Cameo Studio, we specialise in capturing life\u2019s most precious moments with elegance, creativity and authenticity. From the radiant beauty of maternity shoots to the magic of weddings, from the innocence of newborn smiles to visually stunning product and food photography, we turn memories and brands into timeless pieces.',
    'Our photography is more than pictures. It is about preserving emotions, celebrating milestones, and creating visuals that stay with you forever.',
    'Whether you are celebrating love, welcoming a new life, building your brand, or showcasing your products, we bring your vision to life through artistic storytelling and professional care.',
  ],
}

export const process = [
  { step: 'Talk', text: 'A quick WhatsApp call to understand the occasion, the location and the mood you want.' },
  { step: 'Plan', text: 'We suggest timings, outfits and spots based on the light, and lock the date.' },
  { step: 'Shoot', text: 'On the day we stay unobtrusive and let things happen. No stiff posing.' },
  { step: 'Deliver', text: 'Edited photos in an online gallery, usually within two weeks.' },
]
