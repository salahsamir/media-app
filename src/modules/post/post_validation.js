
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
export const add_post=joi.object({
    title:joi.string().required(),
    caption:joi.string(),
    authorization:joi.string().required(),
    file:joi.array().items(generalFields.file)

})
export const both_like=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required()

})
export const update_post=joi.object({
    title:joi.string(),
    caption:joi.string(),
    authorization:joi.string().required(),
    id:generalFields.id.required(),
   



})
export const delete_post=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required()

})
export const update_private=joi.object({
    
    authorization:joi.string().required(),
    id:generalFields.id.required()

})
export const getuser=joi.object({
    authorization:joi.string().required(),


})
