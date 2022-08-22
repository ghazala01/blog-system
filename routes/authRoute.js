const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next({ status: 404, message: 'User/password is wrong' });
    }
    // checking the password from the payload
    const dbPwd = user.password;
    const isSamePassword = await bcryptjs.compare(password, dbPwd);
    if (isSamePassword) {
      // sending jwt token
      const jsonPayload = { name: user.name, id: user._id, email: user.email };
      console.log(process.env.SECRET_KEY);
      const token = jwt.sign(jsonPayload, process.env.SECRET_KEY, { expiresIn: '3d' });
      res.json({ message: 'Login success', token });
    } else {
      next({ status: 404, message: 'User/password is wrong' })
    }
  } catch (error) {
    console.log(error.message);
    next({ status: 500, message: error.message });
  }
});

// register
router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  const encPassword = bcryptjs.hashSync(password, 15);
  try {
    const newUser = await User.create({ name, email, password: encPassword });
    res.json({ user: newUser });
  } catch (error) {
    console.log(error.message);
    next({ status: 500, message: error.message });
  }
});
module.exports = router;