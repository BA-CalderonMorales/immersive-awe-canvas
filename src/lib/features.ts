export const isFeatureEnabled = (flag: string): boolean => {
  const key = `VITE_FEATURE_${flag.toUpperCase()}`;
  return import.meta.env[key] === 'true';
};
