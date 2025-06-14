const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    tasks:{
        type:Array,
    },
    completedTasks:{
        type:Array,
    },twoFA:{
        type:Boolean,
        default:false
    }
    
})

const User=mongoose.model('User',userSchema);

module.exports = User;