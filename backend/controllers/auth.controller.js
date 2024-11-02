import { generateTokenAndSetCookie } from '../libs/Utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req,res) => {
    try {
        
        const {fullName,username,email,password} = req.body;

        const emailRex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        if(!emailRex.test(email)){
            return res.status(400).json({error: "Invalid email address"});
        }

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({error: "Account already exist"});
        }

        const existingEmail = await User.findOne({email});

        if(existingEmail){
            return res.status(400).json({error: "Email already exist"});
        }

        if(password.length < 6){
            return res.status(400).json({error: "Password must be atleast 6 character long"});
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password:hashedPassword,
        });

        if(newUser) {

            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })

        }else {
            res.status(400).json({error : "Invalid User data!"});
        }

    } catch (error) {
        console.log('Error : '+ error.message);
        res.status(500).json({error : "Internal Server Error!"});
    }
};

export const login = async (req,res) => {
    
    try {
        const {username,password} = req.body;
        
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password,user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(500).json({error: "Invalid Username Or Password"});
        }

        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })


        
    } catch (error) {
        console.log('Error : ', error.message);
        res.status(500).json({error : "Internal Server Error!"});
    }
};

export const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{maxAge: 0});
        res.status(200).json({message: "Logged Out! Successfully"});
    } catch (error) {
        console.log('Error : ', error.message);
        res.status(500).json({error : "Internal Server Error!"});
    }
};

export const getUser = async (req,res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    } catch (error) {
        console.log('Error : ', error.message);
        res.status(500).json({error : "Internal Server Error!"});
    }
}