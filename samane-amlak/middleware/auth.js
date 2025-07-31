// 📁 middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware برای احراز هویت با استفاده از JWT
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: '⛔ دسترسی غیرمجاز: توکن ارسال نشده است.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: '⛔ توکن نامعتبر یا منقضی شده است.' });
  }
};

module.exports = authMiddleware;
