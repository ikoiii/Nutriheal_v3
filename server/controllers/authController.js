const { register, login, AuthError } = require('../services/authService');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AuthError('Nama, email, dan password harus diisi', 400));
    }

    const result = await register(name, email, password);
    res.status(201).json(result);

  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AuthError('Email dan password harus diisi', 400));
    }

    const result = await login(email, password);
    res.status(200).json(result);

  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
