
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
export const add_coment=joi.object({
    text:joi.string().required(),
    file:joi.array().items(generalFields.file),
    authorization:joi.string().required(),
    id:generalFields.id.required(),
}).required()
export const both_like=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required()

})
export const reply=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required(),
    post_id:generalFields.id.required(),
    file:generalFields.file,
    text:joi.string().required()

}).required()
export const update_comment=joi.object({

    authorization:joi.string().required(),
    id:generalFields.id.required(),
    text:joi.string().required(),

})
export const delete_comment=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required()

})