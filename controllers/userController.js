//const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

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

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};