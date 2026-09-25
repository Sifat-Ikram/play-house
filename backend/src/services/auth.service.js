const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_EXPIRES_MS,
} = require("../utils/jwt");

const buildAuthResponse = async (user) => {
  const payload = { id: user.id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);
  await userModel.saveRefreshToken(user.id, refreshToken, expiresAt);

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60, // seconds
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

const register = async (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await userModel.getUserByEmail(email);
  if (existingUser) {
    const error = new Error("An account with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const password_hash = await hashPassword(password);
  const user = await userModel.createUser({ name, email, password_hash });

  return await buildAuthResponse(user);
};

const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.getUserByEmail(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return await buildAuthResponse(user);
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    const error = new Error("Invalid or expired refresh token");
    error.statusCode = 401;
    throw error;
  }

  const storedToken = await userModel.findRefreshToken(refreshToken);

  if (!storedToken) {
    const error = new Error("Refresh token not recognized");
    error.statusCode = 401;
    throw error;
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    await userModel.deleteRefreshToken(refreshToken);
    const error = new Error("Refresh token expired, please log in again");
    error.statusCode = 401;
    throw error;
  }

  const user = await userModel.getUserById(decoded.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  // Rotate refresh token: delete old, issue new
  await userModel.deleteRefreshToken(refreshToken);

  return await buildAuthResponse(user);
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;
  await userModel.deleteRefreshToken(refreshToken);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
