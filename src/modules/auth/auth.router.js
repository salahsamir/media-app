import { Router } from "express";
import { validation } from "../../middleware/validation.js";
import { forget, signup, token,change,signin } from "./auth.validation.js";
import * as authControler from './controller/registration.js'
const router = Router()
router.post('/signup',validation(signup),authControler.signup)
router.get('/confiremEmail/:token',validation(token),authControler.confirem)
router.get('/refresh/:token',validation(token),authControler.refresh)
router.post('/forget_password',validation(forget),authControler.forget_password)
router.post('/change/:token',validation(change),authControler.change)
router.post('/signin',validation(signin),authControler.signin)
export default router