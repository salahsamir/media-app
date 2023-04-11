import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as usercontroller from './controller/user.js'
import { delete_user, get_user, logout, picimage, share_link, update_password, updatename } from "./user.validation.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";


const router = Router()
router.patch('/',auth,validation(updatename),usercontroller.update_name)
router.patch('/password',auth,validation(update_password),usercontroller.update_password)
router.post('/share',auth,validation(share_link),usercontroller.share)
router.get('/:_id',validation(get_user),usercontroller.get_user)
router.patch('/logout',auth,validation(logout),usercontroller.logout)
router.put('/image',auth,fileUpload(fileValidation.image).single('image'),validation(picimage),usercontroller.add_picimage)
router.put('/coverimage',auth,fileUpload(fileValidation.image).single('image'),validation(picimage),usercontroller.add_coverimage)

router.delete('/',auth,validation(delete_user),usercontroller.delete_user)

export default router