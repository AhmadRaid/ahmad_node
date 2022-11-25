const mongoose = require('mongoose');

const taskSchema =  new mongoose.Schema({
    name:String,
    description:String,
    user : {
        type : mongoose.Schema.ObjectId,
        ref:"User"
    }
})


taskSchema.pre('save' , async function (next){
   await this.populate({
        path: "user",
        select : "-__v"
    })
    next()
})


module.exports = mongoose.model('Task',taskSchema)