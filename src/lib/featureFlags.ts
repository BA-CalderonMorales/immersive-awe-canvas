export const ENABLED_WORLD_SLUGS = [
  'genesis-torus',
  'distortion-sphere',
  'wobble-field',
  'crystalline-spire',
];

export const FIRST_WORLD_SLUG = ENABLED_WORLD_SLUGS[0];

export const isWorldEnabled = (slug: string) => ENABLED_WORLD_SLUGS.includes(slug);
