const User = require("../models/User");

const signup = async (req, res) => {
    try{
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

module.exports = { signup };