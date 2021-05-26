const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require("../../models/user")

router.get('/login', (req, res) => {
  console.log()
  res.locals.warning_msg = req.flash('error')
  console.log(req.flash('error'))
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
      if(password === confirmPassword){
        return User.create({name, email, password})
                    .then(() => res.redirect("/"))
                    .catch(err => console.log(err))
      } else {
        console.log("Password is different")
        res.render("register", {errors, name, email, password: "", confirmPassword: ""})
      }
      
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Logout success')
  res.redirect('/users/login')
})

module.exports = router