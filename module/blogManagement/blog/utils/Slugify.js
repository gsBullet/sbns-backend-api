const BlogModel = require("../model/BlogModel");

const baseSlugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove non-word chars
    .replace(/[\s_-]+/g, "-") // collapse whitespace/underscores to single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes

/**
 * Generates a unique slug, appending -1, -2, etc. if a collision exists.
 * Pass excludeId when updating an existing blog so it doesn't collide with itself.
 */
const generateUniqueSlug = async (title, excludeId = null) => {
  const base = baseSlugify(title);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };

    const existing = await BlogModel.findOne(query);
    if (!existing) return slug;

    slug = `${base}-${counter}`;
    counter += 1;
  }
};

module.exports = { baseSlugify, generateUniqueSlug };