const AppError = require("./AppError");

/* ─── validateBlog ───────────────────────────────────────────── */
exports.validateBlog = (req, res, next) => {
  const { title, excerpt, content, category } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push("শিরোনাম দিন");
  if (!excerpt?.trim()) errors.push("সংক্ষিপ্ত বিবরণ দিন");
  if (!content?.trim()) errors.push("ব্লগের বিষয়বস্তু দিন");
  if (!category?.trim()) errors.push("বিভাগ নির্বাচন করুন");

  if (title && title.trim().length < 5)
    errors.push("শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

/* ─── validateReject ─────────────────────────────────────────── */
exports.validateReject = (req, res, next) => {
  const { rejectNote } = req.body;

  if (!rejectNote?.trim())
    return next(new AppError("প্রত্যাখ্যানের কারণ লিখুন", 400));

  if (rejectNote.trim().length < 10)
    return next(
      new AppError(
        "প্রত্যাখ্যানের কারণ আরো বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)",
        400,
      ),
    );

  next();
};

/* ─── validateComment ────────────────────────────────────────── */
exports.validateComment = (req, res, next) => {
  const { content } = req.body;

  if (!content?.trim())
    return next(new AppError("মন্তব্যের বিষয়বস্তু দিন", 400));

  if (content.trim().length > 1000)
    return next(new AppError("মন্তব্য ১০০০ অক্ষরের বেশি হতে পারবে না", 400));

  next();
};

exports.validateUserProfile = (req, res, next) => {
  const { username, phone } = req.body;
  const errors = [];

  if (username && username.trim().length < 3)
    errors.push("ব্যবহারকারীর নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (phone && !/^\+?\d{10,15}$/.test(phone.trim()))
    errors.push("সঠিক ফোন নম্বর দিন (১০-১৫ ডিজিট, + দিয়ে শুরু হতে পারে)");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validatePassword = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password && password.trim().length < 6)
    return next(new AppError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে", 400));

  if (password !== confirmPassword)
    return next(new AppError("পাসওয়ার্ড মিলছেন", 400));

  next();
};

exports.validateUserRegistration = (req, res, next) => {
  const { username, email, password, phone, userRole } = req.body;
  const errors = [];

  if (!username?.trim()) errors.push("ব্যবহারকারীর নাম দিন");
  if (!email?.trim()) errors.push("ইমেইল দিন");
  if (!password?.trim()) errors.push("পাসওয়ার্ড দিন");

  if (username && username.trim().length < 3)
    errors.push("ব্যবহারকারীর নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (password && password.trim().length < 6)
    errors.push("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim()) errors.push("ইমেইল দিন");
  if (!password?.trim()) errors.push("পাসওয়ার্ড দিন");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateGalleryCreation = (req, res, next) => {
  const { title, description, images } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push("শিরোনাম দিন");
  if (!description?.trim()) errors.push("বর্ণনা দিন");
  if (!images || !Array.isArray(images) || images.length === 0)
    errors.push("কমপক্ষে একটি ছবি দিন");

  if (title && title.trim().length < 5)
    errors.push("শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে");

  if (description && description.trim().length < 10)
    errors.push("বর্ণনা কমপক্ষে ১০ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateGalleryUpdate = (req, res, next) => {
  const { title, description, images } = req.body;
  const errors = [];

  if (title && title.trim().length < 5)
    errors.push("শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে");

  if (description && description.trim().length < 10)
    errors.push("বর্ণনা কমপক্ষে ১০ অক্ষর হতে হবে");

  if (images && (!Array.isArray(images) || images.length === 0))
    errors.push("কমপক্ষে একটি ছবি দিন");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateResponsibilityCreation = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push("শিরোনাম দিন");

  if (title && title.trim().length < 3)
    errors.push("শিরোনাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateResponsibilityUpdate = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (title && title.trim().length < 3)
    errors.push("শিরোনাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateMemberCreation = (req, res, next) => {
  const { name, phone, presentAddress, permanentAddress, profession } =
    req.body;
  const errors = [];

  if (!name?.trim()) errors.push("সদস্যের নাম দিন");
  if (!phone?.trim()) errors.push("ফোন নম্বর দিন");
  if (!presentAddress?.trim()) errors.push("বর্তমান ঠিকানা দিন");
  if (!permanentAddress?.trim()) errors.push("স্থায়ী ঠিকানা দিন");
  if (!profession?.trim()) errors.push("পেশা দিন");

  if (name && name.trim().length < 3)
    errors.push("সদস্যের নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateMemberUpdate = (req, res, next) => {
  const { name, phone, presentAddress, permanentAddress, profession } =
    req.body;
  const errors = [];

  if (name && name.trim().length < 3)
    errors.push("সদস্যের নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateWardManagement = (req, res, next) => {
  const { wardName, president, vicePresident, secretary } =
    req.body;
  const errors = [];

  if (!wardName?.trim()) errors.push("ওয়ার্ড নাম দিন");
  if (!president?.trim()) errors.push("চেয়ারম্যানের নাম দিন");
  if (!vicePresident?.trim()) errors.push("ভাইস চেয়ারম্যানের নাম দিন");
  if (!secretary?.trim()) errors.push("সচিবের নাম দিন");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateWardManagementUpdate = (req, res, next) => {
  const { wardName, president, vicePresident, secretary } =
    req.body;
  const errors = [];

  if (wardName && wardName.trim().length < 3)
    errors.push("ওয়ার্ড নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};

exports.unitValidator = (req, res, next) => {
  const { unitName } = req.body;
  const errors = [];

  if (!unitName?.trim()) errors.push("ইউনিট নাম দিন");
  if (unitName && unitName.trim().length < 3)
    errors.push("ইউনিট নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (errors.length) return next(new AppError(errors.join(", "), 400));

  next();
};
