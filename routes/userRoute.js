// routes/userRoute.js
import express from 'express';
import { loginUser, registerUser, adminAccess } from '../controllers/usercontroller.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/admin-access', adminAccess);

export default router;
