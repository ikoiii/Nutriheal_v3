const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next(); // IMPORTANT: Call next() and then return to exit the middleware
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' }); // Return here
    }
  }

  // If no token in headers, or if the above block didn't return, then it's unauthorized
  return res.status(401).json({ message: 'Not authorized, no token' });
};

module.exports = { protect };