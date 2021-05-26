const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require("../../models/user")

router.get('/login', (req, res) => {
  res.locals.warning_msg = req.flash('error')
  res.render('login')
})

router.post('/login',  passport.authenticate('local', 
{ failureRedirect: '/users/login',
  failureFlash : true,
  successRedirect: '/'}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body
  const errors = []
  if(!name || !email || !password || !confirmPassword){
    errors.push({'message': 'All fields are required!'})
  }
  if(password !== confirmPassword){
    errors.push({'message': 'Password is different with confirm password!'})
  }
  if(errors.length){
    return res.render("register", {errors, name, email, password, confirmPassword})
  }

  User.findOne({email})
    .then( user => {
      if(user){
        errors.push({'message': "This email is already registered!!"})
        return res.render("register", {errors, name, email, password, confirmPassword})
      }

      return bcrypt.genSalt(10)
                   .then(salt => bcrypt.hash(password, salt))
                   .then(hash => User.create({name, email, password: hash}))
                   .then(() => res.redirect("/"))
                   .catch(err => console.log(err))      
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logout success')
  res.redirect('/users/login')
})

module.exports = router