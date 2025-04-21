const express = require('express');
const passport = require('passport');
const commentController = require('../controllers/commentController');
const authCheck = require('../middleware/authMiddleware')
const router = express.Router();

router.get('/allComment', commentController.allComment);
router.post('/create', authCheck, commentController.comment);
// Reply to a comment
router.post('/:id/replies', authCheck, commentController.createReply);

module.exports = router;