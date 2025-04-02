const express = require('express');
const router = express.Router();
const passport = require('passport');
const { User, Category } = require('../models/user');
//const bcrypt = require('bcrypt');


exports.getUserProfile = async (req, res) => {
    try {
        console.log("REQ.SESSION:", req.session); // Debugging
        console.log("REQ.USER:", req.user); // Debugging


        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'otp', 'otpExpires'] } // Exclude sensitive fields
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from request parameters

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password', 'otp', 'otpExpires'] } // Exclude sensitive data
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'thumbnail']
        })
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

  //  const User = require('../models/User');

  exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, category } = req.body;
        let user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

         // Ensure only the user can update the profile
         if (req.user.id !== user.id) {
            return res.status(403).json({ message: "Unauthorized to update this profile" });
        }

        let thumbnailPath;
        const basePath = `${req.protocol}://${req.get('host')}/Public/uploads/`;

        if (req.file) {
            thumbnailPath = `${basePath}${req.file.filename}`;
        }

        // Update fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (thumbnailPath) user.thumbnail = thumbnailPath;

        // Validate and update category
        if (category) {
            if (!Object.values(Category).includes(category)) {
                return res.status(400).json({ message: "Invalid category" });
            }
            user.category = category;
        }

        await user.save();

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userId = req.params.id;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the logged-in user is an admin OR is deleting their own account
        if (req.session.user.isAdmin || req.session.user.id === user.id) {
            await user.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }

        return res.status(403).json({ message: "Forbidden. You do not have permission to delete this user." });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error });
    }
};