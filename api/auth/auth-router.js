// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const { checkPasswordLength, checkUsernameExists, checkUsernameFree } = require('./auth-middleware')


router.post('/register', checkUsernameFree, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  User.add({ username, password: hash})
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(next)
})

router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body
  console.log(password)
  if(bcrypt.compareSync(password, req.body.password)) {
    req.session.user = req.user
    res.json({ message: `Welcome ${req.body.username}`})
  } else {
    next({ status: 401, message: 'Invalid credentials'})
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err){
      next(err) 
      } else {
        res.json({ message: 'logged out'})
      }
    })
  } else {
    res.json({ message: 'no session' })
  }
})


 
module.exports = router;