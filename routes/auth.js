const express = require('express')
const router = express.Router();
const passport = require('passport');

// @desc Google authenticate
// @route GET/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Google Auth callback
// @route GET/auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

// @desc User Logout
// @route GET/auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;


