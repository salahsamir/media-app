 import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as postController from './controller/post.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { add_post, both_like, delete_post, getuser, update_post, update_private } from "./post_validation.js";
import { commentRouter } from './../comment/controller_router.js';
 export const postRouter=Router();

postRouter.use('/:post_id/comment',commentRouter)

 postRouter.post('/',auth,fileUpload(fileValidation.image).array('image'),validation(add_post),postController.add_post)
 postRouter.get('/',postController.get_all_posts)
 postRouter.patch('/like/:id',auth,validation(both_like),postController.add_like)
 postRouter.patch('/unlike/:id',auth,validation(both_like),postController.add_unlike)
 postRouter.patch('/private/:id',auth,validation(update_private),postController.update_private)
 postRouter.put('/:id',auth,validation(update_post),postController.update_post)
 postRouter.delete('/:id',auth,validation(delete_post),postController.delete_post)
 postRouter.get('/user',auth,validation(getuser),postController.userprofile)

