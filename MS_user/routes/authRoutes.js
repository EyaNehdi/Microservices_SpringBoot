const express = require('express');
const router = express.Router();
const { register,
     checkAuth,
     signIn, signOut,  forgotPassword, resetPassword,
     markChapterAsCompleted,
     trackCurrentLocation,
 } = require('../controllers/authController');


const { verifyToken } = require('../middlewares/verifyToken.js');
const { validateInput } = require('../middlewares/validators.js');

router.get('/check-auth', verifyToken, checkAuth);
router.post('/register', validateInput, register);
router.get('/current-location', verifyToken, trackCurrentLocation);
router.post("/login", signIn);

router.post("/logout", signOut);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/completedchapters", markChapterAsCompleted);



module.exports = router;