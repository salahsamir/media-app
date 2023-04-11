
import { asyncHandeler } from './../../../utils/errorHandling.js';
import userModel from './../../../../DB/model/User.model.js';
import cloudinary from './../../../utils/cloudinary.js';
import { postModel } from '../../../../DB/model/Post.model.js';



export const add_post=asyncHandeler(
    async(req,res,next)=>{
        const{_id}=req.user;
        const user=await userModel.findById(_id)
        if(!user){
            return next(new Error('in valid authorization',{cause:400}))
        }
        req.body.user_id=_id
        const image_list=[]
        if(req.files){
            for (const file of req.files) {
                const{secure_url,public_id}=await cloudinary.uploader.upload(file.path)
                image_list.push({secure_url,public_id})
            }
            req.body.image=image_list
        }
        const create_post=await postModel.insertMany(req.body);
        if(!create_post){
            return next(new Error('in valid inputs',{cause:400}))

        }
        return res.status(201).json({messag:"done",create_post})
    }
)
export const get_all_posts=asyncHandeler(
    async(req,res,next)=>{
        const find=await postModel.find({private:"all"}).populate([
            {path:'user_id',select:"userName"},
            {path:"comments"}
        ])
        return res.status(200).json(find)
    }
)

export const userprofile=asyncHandeler(
    async(req,res,next)=>{
        const posts=await postModel.find({user_id:req.user.id,private:"all"})
           if(!posts){
return next(new Error('post not exist',{cause:400}))
           }
        return res.status(200).json(posts)
    }
)
// all post private or not  but it in my profile in user endpoint
// export const profile=asyncHandeler(
//     async(req,res,next)=>{
//         const posts=await postModel.find({user_id:req.user.id})
//            if(!posts){
// return next(new Error('post not exist',{cause:400}))
//            }
//         return res.status(200).json(posts)
//     }
// )

export const add_like=asyncHandeler(
    async(req,res,next)=>{
     const {id}=req.params;
     
 const update=await postModel.findOneAndUpdate({_id:id,private:"all"},{$addToSet:{like:req.user._id},$pull:{unlike:req.user._id}},{new:true})
 
  if(!update){
    return next(new Error('post not exist'))
  }
  return res.status(200).json(update)

    }
)
export const add_unlike=asyncHandeler(
    async(req,res,next)=>{
     const {id}=req.params;
     
     const update=await postModel.findOneAndUpdate({_id:id,private:"all"},{$addToSet:{unlike:req.user._id},$pull:{like:req.user._id}},{new:true})
     if(!update){
    return next(new Error('post not exist'))
  }
  return res.status(200).json(update)

    }
)
export const update_post=asyncHandeler(
    async(req,res,next)=>{
        const {id}=req.params;  
        const findpost=await postModel.findById(id)
        if(!findpost){
            return next(new Error("post not exist ",{cause:400}))
        }
        const update=await postModel.findOneAndUpdate({_id:id,user_id:req.user.id},req.body,{new:true})
        return update?res.status(200).json({message:"done",update}):next(new Error('only owner can updated',{cause:400}))
       
    }
)
export const delete_post=asyncHandeler(
    async(req,res,next)=>{
        const {id}=req.params
        const findpost=await postModel.findById(id)
        if(!findpost){
            return next(new Error("post not exist ",{cause:400}))
        }
        const post=await postModel.findOneAndDelete({_id:id,user_id:req.user.id},{new:true})
        if(!post){
            return next(new Error("only owner can deleted  "),{cause:409})
        }
        return res.json(post)
        
    }

)
export const update_private=asyncHandeler(
    async(req,res,next)=>{
        const {id}=req.params;
        const findpost=await postModel.findById(id)
        if(!findpost){
            return next(new Error("post not exist ",{cause:400}))
        }
        const update=await postModel.findOneAndUpdate({_id:id,user_id:req.user.id},{private:"private"},{new:true})
        return update?res.json(update):res.json({message:"only owner can update"})
    }
)

