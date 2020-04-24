const router = require('express').Router();
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const secrets = require('../api/secrets');

function generateToken(user){
  const payload = {
    userId: user.id,
    username: user.username,
  };
  const secret = secrets.jwtSecret;
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, secret, options)
}

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body;
  const rounds = process.env.HASH_ROUNDS || 8;
  const hash = bcrpyt.hashSync(user.password, rounds);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json({message: 'User added.', saved});
    })
    .catch(err => {
      res.status(500).json({errorMessage: 'Unable to save user to the server'});
    });
});

router.post('/login', (req, res) => {
  // implement login
  let {username, password} = req.body;

  Users.findBy({username})
    .then(([user])=> {
      if(user && bcrpyt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({message: 'Successfully logged in.', token});
      } else {
        res.status(401).json({message: 'Incorrect password.'});
      }
    })
    .catch(err => {
      res.status(500).json({errorMessage: 'Could not log in.'});
    })
});

module.exports = router;
