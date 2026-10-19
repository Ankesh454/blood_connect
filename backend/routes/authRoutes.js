const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

module.exports = router;
