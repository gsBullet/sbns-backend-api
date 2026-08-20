const BlogModel = require("../model/BlogModel");

const baseSlugify = (text = "") =>
  String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");


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