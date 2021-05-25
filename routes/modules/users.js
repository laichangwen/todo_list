const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require("../../models/user")

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login',  passport.authenticate('local', 
{ failureRedirect: '/users/login',
  successRedirect: '/'}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body

  User.findOne({email})
    .then( user => {
      if(user){
        console.log("User already exists!!")
        res.render("register", {name, email, password, confirmPassword})
      } else {
        if(password === confirmPassword){
          return User.create({name, email, password})
                     .then(() => res.redirect("/"))
                     .catch(err => console.log(err))
        } else {
          console.log("Password is different")
          res.render("register", {name, email, password: "", confirmPassword: ""})
        }
      }
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router