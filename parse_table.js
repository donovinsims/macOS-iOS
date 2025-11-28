const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'temp_apps_table.md';
const OUTPUT_FILE = 'temp_apps_parsed.json';

const platform = 'macOS';

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const seededNumber = (text) => {
  return text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

const deriveRating = (seed) => Number((4 + (seed % 11) / 10).toFixed(1));
const deriveReviewsCount = (seed) => 500 + (seed % 4500);
const deriveCreatedAt = (seed) => {
  const start = new Date('2022-01-01').getTime();
  const day = 24 * 60 * 60 * 1000;
  const offsetDays = seed % 365;
  return new Date(start + offsetDays * day).toISOString();
};

const content = fs.readFileSync(INPUT_FILE, 'utf8');
const lines = content.split('\n').filter((line) => line.trim() !== '');

// Skip header and separator
const dataLines = lines.slice(2);

const apps = dataLines.map((line) => {
  const parts = line.split('|').map((p) => p.trim());

  const name = parts[1];
  const category = parts[2];
  const screenshotUrl = parts[parts.length - 2];
  const downloadUrl = parts[parts.length - 3];
  const price = parts[parts.length - 4];

  const descriptionParts = parts.slice(3, parts.length - 4);
  let description = descriptionParts.join(', ').replace(/\s+,/g, ',');

  if (description.startsWith('"') && description.endsWith('"')) {
    description = description.slice(1, -1);
  }

  const slug = slugify(name);
  const seed = seededNumber(name);
  const rating = deriveRating(seed);
  const reviewsCount = deriveReviewsCount(seed);
  const createdAt = deriveCreatedAt(seed);
  const shortDescription = description.length > 160 ? `${description.slice(0, 157).trim()}...` : description;
  const developer = `${name} Team`;
  const iconUrl = screenshotUrl;

  return {
    name,
    slug,
    description,
    shortDescription,
    developer,
    iconUrl,
    downloadUrl,
    platform,
    category,
    price,
    screenshots: [screenshotUrl],
    rating,
    reviewsCount,
    createdAt,
  };
});

const outputPath = path.join(process.cwd(), OUTPUT_FILE);
fs.writeFileSync(outputPath, JSON.stringify(apps, null, 2));
console.log(`Parsed ${apps.length} apps to ${OUTPUT_FILE}`);
