import mongoose, { model, Schema, Types }from"mongoose";

const post_schema=new Schema({
title:{
    type:String,
    required:true
},
caption:String,
image:Object,
user_id:{
    type:Types.ObjectId,
    ref:'User',
    required:true,
},
like:[{
    type:Types.ObjectId,
    ref:'User' 
}],
unlike:[{
    type:Types.ObjectId,
    ref:'User' 
}],
private:{
    type :String,
    default:'all',
    enum:['private','all']
}
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
post_schema.virtual('comments',{
    localField:'_id',
    foreignField:'post_id',
    ref:'comment',
})
export const postModel=mongoose.models.post|| model('post',post_schema)