const express = require('express');
const router  = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth.middleware');
const Story = require('../models/Story');

// @desc Login/Landing
// @route GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// @route GET/
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        console.log(req.user.id);
        const stories = await Story.find({ user: req.user.id }).lean();
    
        res.render('dashboard', {
            firstName: req.user.firstName,
            stories
        });
        
    } catch (err) {
        console.log(err);
        res.render('/errors/500');
    }
})

module.exports = router;


