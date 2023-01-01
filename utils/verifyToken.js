import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_tokens;
  if (!token) {
    return next(createError(401, "You are not authenticated or token is not received!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    next();
  });
};

export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_tokens;
  if (!token) {
    return next(createError(401, "You are not authenticated or token is not received!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    console.log(`user id ${user._id}`);

    if (user._id === req.params.id || user.isAdmin) {
      console.log(`para id ${req.params.id}`);
      console.log(`user id ${user.isAdmin}`);
      next();
    } else {
      return next(createError(403, "You are not authorized..!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_tokens;
  if (!token) {
    return next(createError(401, "You are not authenticated or token is not received!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    console.log(req.user);
    if (user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not Admin..!"));
    }
  });
};
