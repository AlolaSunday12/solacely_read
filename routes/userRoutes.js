const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware'); 
const path = require('path');

const router = express.Router();


router.put('/updateProfile/:id', authCheck, upload.single('thumbnail'), userController.updateProfile); // ✅ Use userController.updateProfile
router.get('/getAllUsers', authCheck, userController.getAllUsers);
router.get('/Profile', authCheck, userController.getUserProfile);
router.get('/:id',authCheck, userController.getUserById);
router.delete('/:id', authCheck, userController.deleteUser);

// Protect the home route by ensuring the user is authenticated
router.get('/', authCheck, (req, res) => {
    console.log('User in session:', req.user);
    res.status(200).send({ user: req.user });
});

module.exports = router;