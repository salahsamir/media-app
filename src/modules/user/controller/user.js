import { compare, hash } from "../../../utils/HashAndCompare.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandeler } from "../../../utils/errorHandling.js"
import userModel from './../../../../DB/model/User.model.js';

//// to update user name
export const update_name=asyncHandeler(
    async(req,res,next)=>{
        const {userName}=req.body
        const{_id}=req.user
        const update=await userModel.findByIdAndUpdate(_id,{userName},{new:true})
        if(!update){
            return next(new Error('in valid id',{cause:400}))
        }
        return res.status(200).json({message:"update successfully",update})
    }
)
export const update_password=asyncHandeler(
    async(req,res,next)=>{
        const{oldpassword,password,cpassword}=req.body
        const{_id}=req.user;
        const user=await userModel.findById(_id)
       if(!user){
         return next(new Error('OOPS,user not exist '))
       }
       const compare_password=compare({plaintext:oldpassword,hashValue:user.password})
       if(!compare_password){
return next(new Error('OOPS,please write right password'))
       }
   const hash_password=hash({plaintext:password})
       user.password=hash_password
        user.save()
        return  res.status(200).json({message:"process done successfully",user})
    }
)
export const share=asyncHandeler(
    async(req,res,next)=>{
        const {_id}=req.user;
        const link=`${req.protocol}://${req.headers.host}/user/${_id}`
        return res.json({message:"done",link})
    }
)

///get my profile and get all posts private or not >>my profile
export const get_user=asyncHandeler(
    async(req,res,next)=>{
        const {_id}=req.params
        const user=await userModel.findById(_id).populate([{path:'posts'}])
        if(!user){
            return next (new Error('not register account',{cause:409}))
        }
        return res.json({message:"done",user})
    }
)
export const logout=asyncHandeler(
    async(req,res,next)=>{
        const {_id}=req.user;
        const user=await userModel.findByIdAndUpdate(_id,{status:"offline"},{new:true})
        if(!user){
            return next(new Error('in valid inputs ',{cause:400}))
        }
        return res.status(200).json({message:"done",user})
    }
)

export const delete_user=asyncHandeler(
    async(req,res,next)=>{
        const {_id}=req.user;
        const user=await userModel.findByIdAndDelete(_id,{new:true})
        return res.status(200).json({message:"done",user})
    }
)


// in profile image and cover i return the old copy to destory old image
export const add_picimage=asyncHandeler(
    async(req,res,next)=>{
        const{_id}=req.user
        if(!req.file){
            return next(new Error('please upload image'))
        }
       const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`user/${_id}`})
      const user=await userModel.findByIdAndUpdate(_id,{profile_pic:{secure_url,public_id}})
      if(user.profile_pic){
        await cloudinary.uploader.destroy(user.profile_pic.public_id)
      }
  return res.json(user)
    }
)
export const add_coverimage=asyncHandeler(
    async(req,res,next)=>{
        const{_id}=req.user
        if(!req.file){
            return next(new Error('please upload image'))
        }
       const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`user/cover/${_id}`})
      const user=await userModel.findByIdAndUpdate(_id,{cover_pic:{secure_url,public_id}})
      if(user.cover_pic){
        await cloudinary.uploader.destroy(user.cover_pic.public_id)
      }
  return res.json(user)
    }
)