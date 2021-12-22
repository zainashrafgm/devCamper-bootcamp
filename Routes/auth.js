const express = require('express');
const { register,login,getMe,ForgetPassword,resetPassword,updateDetails,updatePassword,logout } = require('../controllers/auth');
const router = express.Router();
const { protect } = require('../Middleware/Auth')


router.get('/logout', logout);
router.post('/register', register);
router.post('/login', login);
router.post('/ForgetPassword', ForgetPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatedetails',protect, updateDetails);
router.put('/updatepassword',protect, updatePassword);
router.get('/getMe',protect,getMe)
module.exports = router;
