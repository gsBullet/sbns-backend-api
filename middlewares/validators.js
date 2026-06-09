const AppError = require("./AppError");

/* ─── validateBlog ───────────────────────────────────────────── */
exports.validateBlog = (req, res, next) => {
  const { title, excerpt, content, category } = req.body;
  const errors = [];

  if (!title?.trim())    errors.push("শিরোনাম দিন");
  if (!excerpt?.trim())  errors.push("সংক্ষিপ্ত বিবরণ দিন");
  if (!content?.trim())  errors.push("ব্লগের বিষয়বস্তু দিন");
  if (!category?.trim()) errors.push("বিভাগ নির্বাচন করুন");

  if (title && title.trim().length < 5)
    errors.push("শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে");

  if (errors.length)
    return next(new AppError(errors.join(", "), 400));

  next();
};

/* ─── validateReject ─────────────────────────────────────────── */
exports.validateReject = (req, res, next) => {
  const { rejectNote } = req.body;

  if (!rejectNote?.trim())
    return next(new AppError("প্রত্যাখ্যানের কারণ লিখুন", 400));

  if (rejectNote.trim().length < 10)
    return next(new AppError("প্রত্যাখ্যানের কারণ আরো বিস্তারিত লিখুন (কমপক্ষে ১০ অক্ষর)", 400));

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

  if (errors.length)
    return next(new AppError(errors.join(", "), 400));

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
  const { name, email, password } = req.body;
  const errors = [];

  if (!name?.trim())     errors.push("নাম দিন");
  if (!email?.trim())    errors.push("ইমেইল দিন");
  if (!password?.trim()) errors.push("পাসওয়ার্ড দিন");

  if (name && name.trim().length < 3)
    errors.push("নাম কমপক্ষে ৩ অক্ষর হতে হবে");

  if (password && password.trim().length < 6)
    errors.push("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে");

  if (errors.length)
    return next(new AppError(errors.join(", "), 400));

  next();
};

exports.validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email?.trim())    errors.push("ইমেইল দিন");
  if (!password?.trim()) errors.push("পাসওয়ার্ড দিন");

  if (errors.length)
    return next(new AppError(errors.join(", "), 400));

  next();
};