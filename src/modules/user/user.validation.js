import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const updatename=joi.object({
    userName:joi.string().required(),
    authorization:joi.string().required()
}).required()
export const update_password=joi.object({
    authorization:joi.string().required(),
    oldpassword:generalFields.password,
    password:generalFields.password.invalid(joi.ref('oldpassword')),
    cpassword:generalFields.cpassword,

}).required()
export const share_link=joi.object({
    authorization:joi.string().required()

}).required()
export const get_user=joi.object({
_id:generalFields.id.required()
}).required()
export const logout=joi.object({
    authorization:joi.string().required()

}).required()

export const picimage=joi.object({
    authorization:joi.string().required(),
    file:generalFields.file.required()

}).required()

export const delete_user=joi.object({
    authorization:joi.string().required()

}).required()