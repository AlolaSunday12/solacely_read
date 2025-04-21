// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
//const { Comment, Reply, User } = require('../models');
//const { User } = require('../models/user'); 
//const { Comment } = require('../models/comment');
const  { Reply, User, Comment }  = require('../models');
//const { isAuthenticated } = require('../middleware/auth'); // Middleware to ensure user is logged in

exports.allComment = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'thumbnail'],
        },
        {
          model: Reply,
          as: 'replies', // ✅ MUST MATCH your alias!
          include: {
            model: User,
            attributes: ['id', 'username', 'thumbnail'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });    
    res.json(comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

// Create a comment
exports.comment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.create({
      content,
      userId: req.user.id
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: {
        model: User,
        attributes: ['username', 'thumbnail']
      }
    });
    res.status(201).json(fullComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment', error: err.message });
  }
};

// Create a reply to a comment
exports.createReply = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: commentId } = req.params;

    const reply = await Reply.create({
      content,
      userId: req.user.id,
      commentId,
    });

    const fullReply = await Reply.findOne({
      where: { id: reply.id },
      include: {
        model: User,
        attributes: ['id', 'username', 'thumbnail'],
      },
    });

    res.status(201).json(fullReply);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create reply', error: err.message });
  }
};


//module.exports = router;