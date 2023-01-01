import userSchems from "../models/userSchems.js"
import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    let newUser = new userSchems({
      // here [username,email,password] varibale name should be same as in userSchems
      // in req.body.[username,email,password] as same you sent json data through api
      username: req.body.username,
      email: req.body.email,
      password: hash
    })
    await newUser.save()
    res.status(200).send('User has been created.');
  } catch (error) {
    /// Custom error
    // next(createError(401,'You are not authenicated')) 

    /// we are gonna handle error by using Next and this error will be handle by error handler in Index.js
    next(error);
  }
}

export const login = async (req, res, next) => {
  try {
    const user = await userSchems.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.JWT)
    //here we send data into token or coockie through jwt



    // here we want to send data fetch from db but we dont wanna send {password & isAdmin}
    //user._doc will remove unnesesory information
    //to see result remove [._doc] from below var
    const { password, isAdmin, ...otherDetails } = user._doc;
    // OR
    // const{_id,username,__v,updatedAt,createdAt} = user;
    if (isPasswordCorrect) {
      // so we remove {password & isAdmin} and send {otherDetails} which will not contain{password & isAdmin}
      // other details should wrap in {}
      res.cookie("access_tokens", token, {httpOnly:true}).status(200).json({ ...otherDetails });
      // OR
      // res.status(200).json({_id,username,createdAt,updatedAt,__v});
    }
  } catch (err) {
    next(err);
  }
};