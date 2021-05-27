const express = require('express')
const router = express.Router()
const passport = require('passport')


router.get('/facebook', passport.authenticate('facebook', 
{ scope: ['eamil', 'public_profile']}))

router.get('/facebook/callback', passport.authenticate('facebook', 
{ failureRedirect: '/users/login',
  failureFlash : true,
  successRedirect: '/'}))


module.exports = router