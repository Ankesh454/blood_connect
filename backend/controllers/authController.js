const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try{
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("Request body:", req.body);
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email Normalize
        const normalizedEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        //Phone Normalize
        const normalizedPhone = phone.trim();
        if (!/^\+?[0-9]{10,15}$/.test(normalizedPhone)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number!"
            });
        }

        //Password validation
        if(password.length < 8){
            return res.status(400).json({
                success:false,
                message: "Password must be at least 8 characters long!"
            });
        }

        //Check duplicate user
        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { phone: normalizedPhone }
            ]
        });

        if(existingUser){
            return res.status(409).json({
                success: false,
                message: "User already exists!"
            })
        }
        
        const registerUser = await User.create({
            name:name,
            email:normalizedEmail,
            phone:normalizedPhone,
            password:password,
        });
        return res.status(201).json({
            success: true,
            message:"Account created successfully"
        })
        
    }catch (error){
        console.error("Signup error:", error.message);

        if(error.code === 11000){
            return res.status(409).json({
                success: false,
                message:"Email or phone number is already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        
        
        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
       
        
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );  
        user.lastLogin = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { signup, login };