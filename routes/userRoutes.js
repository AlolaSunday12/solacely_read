const express = require('express');
const passport = require('passport');
const userController = require('../controllers/userController');
const authCheck = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/getUser', authCheck, userController.getUserProfile);
router.get('/getAllUsers', authCheck, userController.getAllUsers);

// Protect the home route by ensuring the user is authenticated
router.get('/', authCheck, (req, res) => {
    console.log('User in session:', req.user);
    res.status(200).send({ user: req.user });
});

module.exports = router;