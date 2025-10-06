import {User} from "../models/User.js"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const register = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        const existing = await User.findOne({email})
        if(existing){
            return res.status(400).json({message:"user already exists"})
        
        }

        const salt = await bcrypt.getSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const user = await User.create({name,email,password:hashedPassword})

        const token = jwt.sign({name, email},process.env.JWT,
            {expiresIn:"1h"}
        )

        res.cookie("token",token,{
            path:'/',
            httpOnly:true,
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            sameSite:'lax',
            secure: false, // set to true if using https
            domain:'localhost'
        } )

        return res.status(201).json({message:"user created successfully",username:user.name,email:user.email})



    }catch(error){
        res.status(500).json({message:"server error"})
        console.log(error)
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords    
        const isPasswordValid = await bcrypt.compare(password,user.password) // Defined in User model
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { name: user.name, email: user.email },
            process.env.JWT,
            {
                expiresIn: "1h",
            }
        );
        console.log(token)

        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            maxAge: 60 * 60 * 1000,
            sameSite: "lax",
        });

        return res.status(200).json({message:"user logged in successfully",email:user.email,name:user.name});
    } catch (err) {
        console.log(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        // User token check
        const user = await User.find({email:res.locals.jwtData.email});
        console.log(user)

        if (!user) {
            return res
                .status(401)
                .send("User not registered OR Token malfunctioned");
        }

        if (user[0].email !== res.locals.jwtData.email ){
            return res.status(401).send("Permissions didn't match");
        }

        res.clearCookie("token", {
            httpOnly: true,
            domain: "localhost",
            signed: true,
            path: "/",
        });

        return res
            .status(200)
            .json({ message: "OK", name: user[0].name, email: user[0].email });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "ERROR", cause: error.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        // User token check
        const user = await User.find({email:res.locals.jwtData.email});
        console.log(user)
        console.log(res.locals.jwtData.email)

        if (!user) {
            return res
                .status(401)
                .send("User not registered OR Token malfunctioned");
        }

        //
        console.log("user object found in db")
        console.log(typeof user[0].email)

        if (user[0].email !== res.locals.jwtData.email) {
            return res.status(401).send("Permissions didn't match");
        }
       console.log("all checks verified sending user 2000")
        return res
            .status(200)
            .json({ message: "OK", name: user.name, email: user.email });
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "ERROR", cause: error.message });
    }
};
