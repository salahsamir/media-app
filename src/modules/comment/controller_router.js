import { Router } from "express";
import * as commentController from './controller/comment.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { auth } from './../../middleware/auth.js';
import { add_coment, both_like, delete_comment, reply, update_comment } from "./comment.validation.js";

 export const commentRouter=Router({mergeParams:true});


 commentRouter.post('/:id',auth,fileUpload(fileValidation.image).array('image'),validation(add_coment),commentController.add_comment)
 commentRouter.patch('/like/:id',auth,validation(both_like),commentController.add_like)
 commentRouter.patch('/unlike/:id',auth,validation(both_like),commentController.add_unlike)
 commentRouter.put('/:id',auth,validation(update_comment),commentController.update_comment)
 commentRouter.delete('/:id',auth,validation(delete_comment),commentController.delete_comment)
 commentRouter.post('/:post_id/:id',auth,fileUpload(fileValidation.image).single('image'),validation(reply),commentController.add_reply)

