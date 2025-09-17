import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


// generate tokens
const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// Register User
export const register = async (req,res) =>{
    try{
        const {name,email,password} = req.body;
        
        const NormalisedEmail = email.toLowerCase().trim();
        // check if user exists in the db or not.
        const existsUser = await User.findOne({email:NormalisedEmail});
        if(existsUser) return res.status(400).json({message:"User already exists. Please Login."});

        // hasah the password
        const hashPassword = await bcrypt.hash(password,10);

        // create the new user 
        const newUser = new User({name,email,password:hashPassword});
        await newUser.save();

        const token = generateToken(newUser._id);
        res.status(201).json({message:"User regsitered Successfully.", token, 
            user:{
                id:newUser._id, 
                name: newUser.name, 
                email: newUser.email,
                role:newUser.role
            }});
    }catch(error){
        res.status(400).json({message:"Server Error.", error:error.message});
    }
};

export const login = async (req,res) =>{
    try {
        // get information
        const {email, password} = req.body;

        const NormalisedEmail = (email || "").toLowerCase().trim();
        // check if user is exists or not in the db.
        const user = await User.findOne({email:NormalisedEmail});
        if(!user) return res.status(400).json({message:"User not Found. Please Register."});

        // comapare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message:"Invaild credentials."});

        const token = generateToken(user._id);
        // you can set sessions or tokens here.
        res.status(200).json({message:"Login Successful", token, 
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email,
                role:user.role
            }});
    } catch (error) {
        res.status(500).json({message:"Server Error.", error:error.message});
    }
};

// Useful for checking current session/user in Postman
export const me = async (req, res) => {
  try {
    // req.user is attached by protect()
    const safeUser = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    };
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


// ✅ Update user name
export const updateUser = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true, select: "-password" } // return updated user without password
    );

    res.json({
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};