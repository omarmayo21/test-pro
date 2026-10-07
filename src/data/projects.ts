export type ProjectCategory = 'visuals' | 'social' | 'branding'
export type ProjectMedia = 'photo' | 'identity'

export type Project = {
  id: string
  number: string
  title: string
  industry: string
  category: ProjectCategory
  categoryLabel: string
  scope: string
  media: ProjectMedia
  image?: string
  srcSet?: string
  brandVariant?: 1 | 2 | 3
  alt: string
}

function responsiveImage(name: string, sourceWidth: number) {
  const widths = [...new Set([480, 800, 1200, sourceWidth].filter((width) => width <= sourceWidth))]
  return {
    image: `/images/${name}.webp`,
    srcSet: widths.map((width) => `/images/${name}${width === sourceWidth ? '' : `-${width}`}.webp ${width}w`).join(', '),
  }
}

// Replace the illustrative cover artwork with approved portfolio imagery before launch.
export const projects: Project[] = [
  {
    id: 'place-and-form',
    number: '01',
    title: 'Place & form',
    industry: 'Real estate',
    category: 'visuals',
    categoryLabel: 'Visuals',
    scope: 'Campaign visual',
    media: 'photo',
    ...responsiveImage('hero-estate', 1122),
    alt: 'Contemporary limestone architecture in warm late-afternoon light',
  },
  {
    id: 'open-horizon',
    number: '02',
    title: 'Open horizon',
    industry: 'Tourism',
    category: 'visuals',
    categoryLabel: 'Visuals',
    scope: 'Campaign visual',
    media: 'photo',
    ...responsiveImage('coast-campaign', 1536),
    alt: 'Limestone coastline meeting a wide expanse of deep blue water',
  },
  {
    id: 'learning-in-focus',
    number: '03',
    title: 'Learning in focus',
    industry: 'Education',
    category: 'visuals',
    categoryLabel: 'Visuals',
    scope: 'Campaign visual',
    media: 'photo',
    ...responsiveImage('education-campaign', 1122),
    alt: 'A student reading in a sunlit contemporary library',
  },
  {
    id: 'room-for-form',
    number: '04',
    title: 'Room for form',
    industry: 'Furniture',
    category: 'visuals',
    categoryLabel: 'Visuals',
    scope: 'Marketing visual',
    media: 'photo',
    ...responsiveImage('furniture-campaign', 1536),
    alt: 'Sculptural walnut lounge chair in a warm, minimal interior',
  },
  {
    id: 'made-for-the-moment',
    number: '05',
    title: 'Made for the moment',
    industry: 'Food & beverage',
    category: 'social',
    categoryLabel: 'Social media',
    scope: 'Social campaign',
    media: 'photo',
    ...responsiveImage('food-social', 1122),
    alt: 'Pistachio pastry and espresso on a deep red tabletop',
  },
  {
    id: 'daily-ritual',
    number: '06',
    title: 'The daily ritual',
    industry: 'Beauty',
    category: 'social',
    categoryLabel: 'Social media',
    scope: 'Social campaign',
    media: 'photo',
    ...responsiveImage('beauty-social', 1122),
    alt: 'Amber glass skincare bottle against warm stone and translucent petals',
  },
  {
    id: 'clear-connection',
    number: '07',
    title: 'A clearer connection',
    industry: 'Technology',
    category: 'social',
    categoryLabel: 'Social media',
    scope: 'Social campaign',
    media: 'photo',
    ...responsiveImage('tech-social', 1122),
    alt: 'Unbranded smartphone in a sculptural dark set with blue light',
  },
  {
    id: 'care-considered',
    number: '08',
    title: 'Care, considered',
    industry: 'Healthcare',
    category: 'social',
    categoryLabel: 'Social media',
    scope: 'Social campaign',
    media: 'photo',
    ...responsiveImage('healthcare-social', 1536),
    alt: 'Apothecary glass bottles on a bright, clean counter',
  },
  {
    id: 'color-with-character',
    number: '09',
    title: 'Color with character',
    industry: 'Consumer brands',
    category: 'social',
    categoryLabel: 'Social media',
    scope: 'Social campaign',
    media: 'photo',
    ...responsiveImage('consumer-social', 1122),
    alt: 'A vivid orange citrus drink can surrounded by fresh fruit',
  },
  {
    id: 'identity-forms-01',
    number: '10',
    title: 'Identity forms 01',
    industry: 'Brand identity',
    category: 'branding',
    categoryLabel: 'Branding / logos',
    scope: 'Logo exploration',
    media: 'identity',
    brandVariant: 1,
    alt: 'Abstract warm-toned identity study with a geometric symbol and palette',
  },
  {
    id: 'identity-forms-02',
    number: '11',
    title: 'Identity forms 02',
    industry: 'Brand identity',
    category: 'branding',
    categoryLabel: 'Branding / logos',
    scope: 'Logo exploration',
    media: 'identity',
    brandVariant: 2,
    alt: 'Abstract dark identity study with a line-based symbol and tonal palette',
  },
  {
    id: 'identity-forms-03',
    number: '12',
    title: 'Identity forms 03',
    industry: 'Brand identity',
    category: 'branding',
    categoryLabel: 'Branding / logos',
    scope: 'Logo exploration',
    media: 'identity',
    brandVariant: 3,
    alt: 'Abstract bright identity study with a modular symbol and color palette',
  },
]

export const categoryFilters: { id: 'all' | ProjectCategory; label: string }[] = [
  { id: 'all', label: 'All work' },
  { id: 'visuals', label: '01 / Visuals' },
  { id: 'social', label: '02 / Social media' },
  { id: 'branding', label: '03 / Branding / logos' },
]
