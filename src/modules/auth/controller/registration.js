
import { asyncHandeler } from './../../../utils/errorHandling.js';
import userModel from './../../../../DB/model/User.model.js';
import { generateToken, verifyToken } from './../../../utils/GenerateAndVerifyToken.js';
import { compare, hash } from './../../../utils/HashAndCompare.js';
import sendEmail from './../../../utils/email.js';


export const signup=asyncHandeler(
    async(req,res,next)=>{
        const {userName,email,password}=req.body;
        const check_user=await userModel.findOne({email})
        if(check_user){
            return next(new Error('email exist ',{cause:409}))//conflict
        }
        const token=generateToken({payload:{email},expiresIn : 60 * 5})
        const ref_token=generateToken({payload:{email},expiresIn : 60 * 60 * 24})

        const confirem_link=`${req.protocol}://${req.headers.host}/auth/confiremEmail/${token}`
        const refresh_link=`${req.protocol}://${req.headers.host}/auth/refresh/${ref_token}`
        const send_email=await sendEmail({to:email,subject:"confirem emial",html:`<a href=${confirem_link}> click here to confirem your email</a>
        <br>
        <a href=${refresh_link}>refrsh email</a>
        
        `})
      if(!send_email){
        return next(new Error('email reject',{cause:400}))
      }  
      const hash_password=hash({plaintext:password})
      const add_user=await userModel.create({userName,email,password:hash_password})
      return res.status(201).json({message:" done ...please confirem your email"})
    
    
    }
)
export const confirem=asyncHandeler(
    async(req,res,next)=>{
        const{token}=req.params;
        const {email}=verifyToken({token})
        const user=await userModel.findOneAndUpdate({email},{confirmEmail:true},{new:true})
        if(!user){
            return next(new Error('in valid token payload',{cause:400}))
        }
        return res.status(200).json({message:"done",new_User:user})

    }
)
export const refresh=asyncHandeler(
    async(req,res,next)=>{
        const{token}=req.params;
        const {email}=verifyToken({token})
        const user=await userModel.findOne({email})
        if(!user){
            return next(new Error('in valid token payload',{cause:400}))
        }
        const newtoken=generateToken({payload:{email},expiresIn : 60 * 2})
        const confirem_link=`${req.protocol}://${req.headers.host}/auth/confiremEmail/${newtoken}`
        const refresh_link=`${req.protocol}://${req.headers.host}/auth/refresh/${token}`
        const send_email=await sendEmail({to:email,subject:"confirem emial",html:`<a href=${confirem_link}> click here to confirem your email</a>
        <br>
        <a href=${refresh_link}>refrsh email</a>
        
        `})
      if(!send_email){
        return next(new Error('email reject',{cause:400}))
      } 

        return res.status(200).json({message:"done"})
    }
)
export const forget_password=asyncHandeler(
    async(req,res,next)=>{
        const{email}=req.body
        const user=await userModel.findOne({email})
        if(!user){
             return next(new Error('OOPS email not exist',{cause:400}))
        }
        if(!user.confirmEmail){
            return next(new Error('OOPS  you must confirem your email',{cause:400}))

        }
          const code=Math.floor(Math.random()*9000)+1000
         const token=generateToken({payload:{code:code,email}})
         const link=`${req.protocol}://${req.headers.host}/auth/change/${token}`
         const send=await sendEmail({to:email,html:`<a href=${link}>${code}</a>`,subject:'get code'})
        if(!send){
            return next(new Error('invalid token',{cause:400}))
        }
     return res.status(200).json({message:"done please check your code ",token})
    }
)
export const change=asyncHandeler(
    async(req,res,next)=>{
        const{token}=req.params;
        const data=verifyToken({token})

        const {code,password}=req.body
        if(data.code!=code){
            return next(new Error('invalid code,please write  rigth code'))
        }
        const hash_password=hash({plaintext:password})
        const user=await userModel.findOneAndUpdate({email:data.email},{password:hash_password},{new:true})
        return res.status(200).json({message:"process done successfully"})

    }
)
export const signin=asyncHandeler(
    async(req,res,next)=>{
        const{email,password}=req.body;
        const user=await userModel.findOne({email})
        if(!user){
             return next(new Error('OOPS email not exist',{cause:400}))
        }
        if(!user.confirmEmail){
            return next(new Error('OOPS  you must confirem your email',{cause:400}))

        }

        const comp=compare({ plaintext:password,hashValue:user.password})
        if(!comp){
            return next(new Error('in-valid password',{cause:400}))
        }
        const token=generateToken({payload:{id:user._id}})
        user.status='online';
      
        user.save()
        return res.status(200).json({message:"process done,successfully",token})
    }
)