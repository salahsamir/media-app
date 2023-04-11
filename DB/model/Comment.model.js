import mongoose, { model, Schema, Types }from"mongoose";

const comment_schema=new Schema({
text:{
    type:String,
    required:true
},
image:Object,
post_id:{
    type:Types.ObjectId,
    ref:'post',
    required:true,
},
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
reply:[{
    type:Types.ObjectId,
    ref:'comment'
}]



},{
    timestamps:true
})

export const commentModel=mongoose.models.comment|| model('comment',comment_schema)