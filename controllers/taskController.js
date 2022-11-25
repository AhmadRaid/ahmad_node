const Task = require('../models/task')
const AppError = require('../utils/AppError')

exports.getTask = async (req, res,next) => {
    const task =  await Task.find({})
    
    res.status(200).json({
        task
    })
}

exports.createTask = async (req, res, next) => {
   const task =  await Task.create(req.body)

   if(!task){
    return next(new AppError("Task is not found" , 404))
   }
    res.status(200).json({
        task
    })

}


exports.showTask = async(req, res, next) => {
    const task = await Task.findById(req.params.id)
 
     res.status(200).json({
         task
     })
 
 }


 exports.updateTask = async(req, res, next) => {

    const task = await Task.findByIdAndUpdate(req.params.id , req.body)
 
     res.status(200).json({
         task
     })
 
 }


 exports.deleteTask = async(req, res, next) => {
    const task = await Task.findByIdAndDelete(req.params.id)
 
     res.status(200).json({
         task
     })
 
 }

 