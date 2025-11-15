import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({success: false,message: "All fields are required"});
        }
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.json({success:false,message:"Username already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // bcrypt.hash(inputpassword,salt rounds) → function to hash a plain-text password.
        // hashedPassword → the final hashed string stored in MongoDB.
        const newUser = new User({ username, password: hashedPassword, role })
        
        await newUser.save();

        res.status(201).json({ success: true, message: `User registered with username ${username}`})
    }
    catch (error) {
        console.log("Error :", error.message)
        return res.status(500).json({ success: false, message: "Something went wrong" })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({success: false, message: "Username and password are required"});
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: `User with username ${username} not found` })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        // bcrypt.compare(inputpassword,hashedpassword generated during regsiteration)
        if (!isMatch) {
            return res.status(400).json({ success: false, message: `Invalid Credentials` })
        }
        const token = jwt.sign(
            { id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }
            // jwt.sign(payload,secret key,options)
        )
        return res.status(200).json({
            success:true,
            message:"Login successful",
            token,
            user:{
                _id:user._id.toString(),
                username:user.username,
                role:user.role}})
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


// Hashing is the process of converting input data (like a password or file) into a fixed-length string of characters using a mathematical algorithm.
// No matter the input size, the hash length is always the same.Hashing → irreversible (you cannot get the password back from the hash)

// Salt = a random string of characters added to the password before hashing.Purpose: Prevents attackers from using precomputed hash databases (rainbow tables) to guess passwords.bcrypt uses the formula 2^n (where n = number of rounds).Example:10 rounds → bcrypt performs 1024 iterations of hashing.

// salt rounds = “how many times bcrypt should process the password+salt”.

// bcrypt.hash() → function to hash a plain-text password.
// hashedPassword → the final hashed string stored in MongoDB.

// bcrypt stands for “Blowfish Crypt” (based on the Blowfish cipher).

// It is a password-hashing function used to securely store passwords.

// Instead of saving plain-text passwords in the database (which is unsafe 🚨), bcrypt converts them into a hashed form that looks random and is almost impossible to reverse.

// It also adds a salt (random string) before hashing → this prevents attacks like rainbow tables.

// JWT (JSON Web Token) is a secure way to send data between a client (browser/app) and a server.It’s like a digital ID card.The server gives the client a signed token when they log in.The client then uses this token to prove who they are in future requests (instead of sending username & password every time).

// A JWT has 3 parts (separated by .): Header.Payload.Signature

// Header (algorithm & token type)-{
//   "alg": "HS256",
//   "typ": "JWT"
// }

// Payload (your data)- {
//   "id": "64af3b28e72a",
//   "role": "admin",
//   "iat": 1727619402,   // issued at time (auto-generated)
//   "exp": 1727623002    // expiry time (1h later)
// }

// Signature (verification part) -Created using the header + payload + secret key.Ensures the token hasn’t been modified.

// Payload = user info inside the token.The payload is the data inside the JWT.you should never put sensitive info like passwords inside.The payload is not encrypted, only encoded.

// Secret key = server-only key to ensure authenticity.The secret key is like the signature pen used to sign the JWT.Only the server knows this key.

// Options = extra settings (like expiry).Options are settings for the token.Common options:expiresIn: How long the token is valid."1h" = 1 hour",algorithm: The algorithm used to sign the token (default is HS256).