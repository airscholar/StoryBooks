const express = require('express')
const router  = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth.middleware')

// @desc Login/Landing
// @route GET/
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
// @route GET/
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user);
    res.render('dashboard', {
        firstName: req.user.firstName
    })
})

module.exports = router;


