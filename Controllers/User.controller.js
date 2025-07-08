import User from "../Models/User.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generatetoken.js";

export const signup = async (req, res) => {
  console.log("Signup request body:", req.body);

  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      console.log("Password mismatch");
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    console.log("User found?", user);

    if (user) {
      return res.status(400).json({ error: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });

    const savedUser = await newUser.save();
    if(newUser){
        createTokenAndSaveCookie(savedUser._id, res);
         return res.status(201).json({
        message: "User created successfully",
        user: {
             _id: savedUser._id,
            fullname: savedUser.fullname,
            email: savedUser.email,
      },
    });
    }
    console.log("User saved:", savedUser);

    try {
      createTokenAndSaveCookie(savedUser._id, res);
      console.log("Token created and cookie sent");
    } catch (err) {
      console.error("Token creation error:", err);
      return res.status(500).json({ error: "Token creation failed" });
    }

  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        const isMatch =  await bcrypt.compare(password, user.password);
        if(!user || !isMatch){
            return res.status(400).json({message: 'Invalid email or password'})
        }
        createTokenAndSaveCookie(user._id, res);
        res.status(200).json({message: 'Login successful', user:{
            fullname: user.fullname,
            email: user.email,
            id: user._id
        }});
    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal server error'})
    }
}

export const logout = async (req,res) => {
 try {
    res.clearCookie('jwt');
    res.status(200).json({message: 'User Log successful'});
 } catch (error) {
    console.log(error.message)
    res.status(500).json({message: 'Internal server error'})
 }
}

export const getUserProfile = async(req,res) => {
  try {
    const loggedInUserId = req.user._id; 
    const allusers = await User.find({_id:{$ne: loggedInUserId}}).select('-password');
    res.status(201).json(allusers);
  } catch (error) {
    console.log("Error in allusers controller:" + error);
    res.status(500).json({message: 'Internal server error'});
  }
}