import express from 'express';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

import userController from '../controllers/userController';

const router = express.Router();

router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);
router.get('/register', userController.user_register_get);
router.post('/register', userController.user_register_post);
router.get('/logout', userController.user_logout_get);

module.exports = router;