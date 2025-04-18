const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminAuthController');

router.post('/register', async (req, res, next) => {
    try {
        await registerAdmin(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try{
        await loginAdmin(req, res);
    } catch (err){
        next(err);
    }
});

module.exports = router;