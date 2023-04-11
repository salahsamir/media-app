import { commentModel } from "../../../../DB/model/Comment.model.js";
import { postModel } from "../../../../DB/model/Post.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { asyncHandeler } from "../../../utils/errorHandling.js";


// only post is private ==all
export const add_comment=asyncHandeler(
    async(req,res,next)=>{
        req.body.post_id=req.params.id;
        req.body.user_id=req.user.id;
       const find_post =await postModel.findOne({_id:req.params.id,private:"all"})
       if(!find_post){
        return next(new Error('post not found',{cause:400}))
    }
        const image_list=[]
        if(req.files){
            for (const file of req.files) {
                const{secure_url,public_id}=await cloudinary.uploader.upload(file.path)
                image_list.push({secure_url,public_id})
            }
            req.body.image=image_list
        }
        const comment=await commentModel.create(req.body)
        return res.status(201).json(comment)
    }
)

// comment >>اكيد هيكون في post 
export const update_comment=asyncHandeler(
    async(req,res,next)=>{
        const {id}=req.params;
        const check_comment=await commentModel.findOne({_id:id})
        if(!check_comment){
            return next (new Error('comment not extis',{cause:409}))
        }
        const update_comment=await commentModel.findOneAndUpdate({_id:id,user_id:req.user.id},req.body,{new:true})
        return update_comment? res.status(200).json({message:"done",update_comment}):next(new Error('only owner can update',{cause:400}))
    }
)
export const delete_comment=asyncHandeler(
    async(req,res,next)=>{
        const {id}=req.params;
        const check_comment=await commentModel.findOne({_id:id})
        if(!check_comment){
            return next (new Error('comment not extis',{cause:409}))
        }
        const delete_comment=await commentModel.findOneAndDelete({_id:id,user_id:req.user.id},{new:true})
        return delete_comment? res.status(200).json({message:"done",update_comment}):next(new Error('only owner can delete',{cause:400}))
    }
)

export const add_like=asyncHandeler(
    async(req,res,next)=>{
        const{id}=req.params;
        req.body.user_id=req.user.id;
        const addlike=await commentModel.findOneAndUpdate({_id:id},{$addToSet:{like:req.user._id},$pull:{unlike:req.user._id}},{new:true})

        
        return addlike ? res.status(200).json(addlike):next(new Error('commentnor found',{cause:400}))
    }
)
export const add_unlike=asyncHandeler(
    async(req,res,next)=>{
        const{id}=req.params;
        req.body.user_id=req.user.id;
        const addlike=await commentModel.findOneAndUpdate({_id:id},{$addToSet:{unlike:req.user._id},$pull:{like:req.user._id}},{new:true})

       
        
        return addlike ? res.status(200).json(addlike):next(new Error('comment not found'))
    }
)

export const add_reply=asyncHandeler(
    async(req,res,next)=>{
        req.body.post_id=req.params.post_id;
        req.body.user_id=req.user.id;
        if(req.file){
            const{secure_url,public_id}=await cloud.uploader.upload(req.file.path)
            req.body.image={secure_url,public_id}
        }
        const find_comment=await commentModel.findById(req.params.id).populate([{path:"reply",select:"text"}])
        if(!find_comment){
            return next(new Error('comment not found',{cause:400}))
        }
        const reply=await commentModel.create(req.body)
        find_comment.reply.push(reply._id)
        find_comment.save()
        return res.status(201).json({comment:find_comment})
    }
)