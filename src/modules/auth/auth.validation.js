import joi from 'joi'
import { generalFields } from './../../middleware/validation.js';


export const signup=joi.object({
  
    userName:joi.string().required(),
    email:generalFields.email,
    password:generalFields.password,
    cpassword:generalFields.cpassword
 
}).required()

export const token=joi.object({
    token:joi.string().required()
 
}).required()

export const forget=joi.object({
        email:generalFields.email.messages({ "string.email":"invalid email"})
   
    }).required()


export const change=joi.object({
        password:generalFields.password,
    cpassword:generalFields.cpassword,
        code:joi.number().min(1000).max(9999),
        token:joi.string().required()



    }).required()
export const signin=joi.object({
        email:generalFields.email.messages({ "string.email":"invalid email"}),
        password:generalFields.password,

   
    }).required()
