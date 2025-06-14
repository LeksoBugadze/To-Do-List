require('dotenv').config();
const bcrypt=require('bcrypt');
const crypto=require('crypto')
const {Resend}=require('resend');
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
const User=require('./userSchema');

const PORT=8000;

const resend=new Resend(process.env.API_KEY);


app.use(cors());
app.use(express.json());

const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

async function sendEmailFunction(receiver,content,subject){
    try{
        const data = await resend.emails.send({
            from:'to-Do List <noreply@update.aleksandrebugadze.com>',
            to:receiver,
            subject:subject,
            html:content
        })

    }catch(error){
        console.error(error);
    }
}




async function startServer(){
    try{
       await mongoose.connect('mongodb://127.0.0.1:27017/todoList');
        
        console.log('connected to mongoDB');

        app.listen(PORT,()=>{
            console.log(`Server is running on ${PORT}`);
        });

    }catch(error){
        console.log(error);
    }
}

const verificationCodes = {};

app.post('/sendCode',async (req,res)=>{
    
    const {email}=req.body;
    try{
        const findUser=await User.findOne({email:email});
        if(findUser){
            return res.status(400).json({error:'User with that email already exists'});
        }
        const generateCode=crypto.randomInt(10000,99999).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        const html=`
        <div>
            <h2>Email verification</h2>           
            <h1>Here is your verification code:<br>${generateCode}<br></h1>
            <h2>
                Enter this code on web-site to sign-up.
                If this email was sent to you by mistake, then u can ignore it.
            </h2>
        </div>
        `
        verificationCodes[email] = { generateCode, expiresAt };
    
        await sendEmailFunction(email,html,'Verify');
    
        res.status(200).json({success:'Email was sent'})
    }catch(error){
        console.log(error);
    }

})

app.post('/sign-up',async (req, res) => {
    try{

        const { email, userName, password } = req.body;
        const hashedPassword=await bcrypt.hash(password,12)
        const newUser = new User({ userName,email, password:hashedPassword });

        const savedUser=await newUser.save();
        
        res.status(201).json({success:'new user added',id:savedUser._id});
        

    }catch(error){
        res.status(400).json({error:error.message})
    }

});


app.post('/login',async (req,res)=>{
    try{
        const {email,password}=req.body;

        const find = await User.findOne({email})

        if (!find) {
            return res.status(404).json({ error: 'Invalid account' });
        }

        const isMatch=await bcrypt.compare(password,find.password)
        
        if(isMatch){
            res.status(200).json({success:'Login was successful',userName:find.userName,id:find._id,twoFA:find.twoFA});
        }else{
            res.status(404).json({error:'Invalid account'});
        }
    }catch(error){
        console.log(error);
    }
});


app.post('/getTasks',async (req,res)=>{
    try{
        const {id}=req.body;

        const findTasks=await User.findById({_id:id});

        if(findTasks){
            res.status(200).json(findTasks.tasks);
        }else{
            res.status(404).json({error:'User Not Found'});
        }

    }catch(error){
        console.log(error);
    }
})

app.post('/addTask',async (req,res)=>{
   try{
        const id=req.body.id;
        const newTaskDescription=req.body.taskDescription;
        const updateUserTasks=await User.findById({_id:id});
        updateUserTasks.tasks.push({description:newTaskDescription});
        await updateUserTasks.save();
        res.status(200).json({success:'Task added',tasks:updateUserTasks.tasks});
    }catch(error){
        console.log(error);
   }

})

app.post('/verify', async (req, res) => {
    const { email,code } = req.body;
    const stored = verificationCodes[email];

    if (!stored) return res.status(400).json({ error: 'No code sent' });
    if (Date.now() > stored.expiresAt) return res.status(400).json({ error: 'Code expired' });

    if (stored.generateCode !== code) return res.status(400).json({ error: 'Invalid code' });
    delete verificationCodes[email];
    res.status(200).json({ success: 'Email verified' });
});

app.put('/complete/user/:id/task/:index',async(req,res)=>{
    try{
        const {id,index}=req.params;
        const task=req.body;
        const user=await User.findById({_id:id});
        const date=new Date();
        const day=date.getDate();
        const month=months[date.getMonth()];
        const dayOfWeek=days[date.getDay()];
        user.tasks.splice(index,1);
        user.completedTasks.push({
            description:task.description,
            completionDate:day,
            completionMonth:month,
            completionDay:dayOfWeek
        });
        user.save();
        res.status(200).json({success:'Task was succesfully completed',tasks:user.tasks});
    }catch(error){
        console.log(error);
    }
});


app.put('/edit/user/:id/task/:index',async(req,res)=>{
    try{
        const {id,index}=req.params;
        const task=req.body;
        const user=await User.findById({_id:id});
        user.tasks[index]=task;
        await user.save();
        
        res.status(200).json({success:"Task succesfully edited",tasks:user.tasks});
    }catch(error){
        console.log(error);
    }
});

app.delete('/user/:id/task/:index',async (req,res)=>{
    try{    
        const {id,index}=req.params;
        const findUser= await User.findById({_id:id});
        findUser.tasks.splice(index,1);
        await findUser.save();
        res.status(200).json({success:'Task deleted',tasks:findUser.tasks})
    }catch(error){
        console.log(error);
    }
});

app.delete('/delete/completedTasks/user/:id/index/:index',async (req,res)=>{
    try{
        const {id,index}=req.params;

        const user=await User.findById({_id:id});

        user.completedTasks.splice(index,1);

        await user.save()
        res.status(200).json({success:'Task Successfully delted',completedTasks:user.completedTasks});
        
    }catch(error){
        console.log(error);
    }
})

app.post('/sendverifyCode',async (req,res)=>{
    try{
        const {email}=req.body;

        const findUser=await User.findOne({email:email});

        if(findUser){
            const generateCode=crypto.randomInt(10000,99999).toString();
            const expiresAt = Date.now() + 10 * 60 * 1000;
            const html=
            `
            <div>
                <h2>We received a request to reset the password for your account</h2>           
                <h1>Here is your verification code:<br>${generateCode}<br></h1>
                <h2>
                    Enter this code on web-site.
                    If you did not request a code from the web-site, you can safely ignore this email.
                </h2>
            </div>
            `
            verificationCodes[email] = { generateCode, expiresAt };
            
            await sendEmailFunction(email,html,'Verify');
            res.status(200).json({success:'User Found'});

        }else{
            res.status(404).json({error:'User was not found'});
        }

    }catch(error){
        console.log(error)
    }
})

app.post('/setNewPassword',async (req,res)=>{
    try{

        const {email,password}=req.body;
        const newPassword=await bcrypt.hash(password,12);
        const findUser=await User.findOneAndUpdate({email},{password:newPassword},{new:true})
    
        if(!findUser){
            return res.status(404).json({ error: "User not found" });
        }
    
        res.status(200).json({success:'Password was changed'});
    }catch(error){
        console.log(error);
    }

})

app.get('/completedTasks/user/:id',async (req,res)=>{
    try{
        const {id}=req.params;

        const user=await User.findById({_id:id});

        res.status(200).json({success:'Task were successfully transfered',completedTasks:user.completedTasks})

    }catch(error){
        console.log(error);
    }
})

app.get('/getUserData/id/:id',async (req,res)=>{
    try{
        const {id}=req.params;

        const user=await User.findById({_id:id});

        if(!user){
            return res.status(404).json({error:'USER WAS NOT FOUND'})
        }

        res.status(200).json({success:'User was found',email:user.email,userName:user.userName,twoFA:user.twoFA});
        
    }catch(error){
        console.log(error);
    }
})

app.post('/checkPassword',async(req,res)=>{
    try{
        const {password,userID}=req.body;

        const user=await User.findById({_id:userID});

        if(!user){
            return res.status(404).json({error:'USER WAS NOT FOUND'});
        }

        const checkPassword=await bcrypt.compare(password,user.password);

        if(checkPassword){
            res.status(200).json({success:'Password is correct'})
        }else{
            res.status(400).json({error:'Password is incorrect'});
        }
        

    }catch(error){
        console.log(error);
    }
})

app.get('/changeEmail/id/:id/:email',async (req,res)=>{
    try{
        const {id,email}=req.params;



        const findUser=await User.findById({_id:id});

        const checkMail=await User.findOne({email:email});

        
        if(!findUser){
            return res.status(404).json({error:'User Not Found'});
        }

        if(checkMail){
            return res.status(400).json({error:'User with that email already exists',email:findUser.email})
        }

        const findAndUpdateUserEmail=await User.findByIdAndUpdate({_id:id},{email:email},{new:true});

        if(findAndUpdateUserEmail){
            return res.status(200).json({success:'Email was updated'});
        }

        return res.status(400).json({error:'Something went wrong'});

    }catch(error){
        console.log(error);
    }
})

app.get('/changeUserName/id/:id/:userName',async (req,res)=>{
    try{
        const {id,userName}=req.params;

        const findUser=await User.findByIdAndUpdate({_id:id},{userName:userName},{new:true});

        if(!findUser){
            res.status(404).json({error:'User Not Found'});
        }
        
        res.status(200).json({success:'Username was updated'});

    }catch(error){
        console.log(error);
    }
})

app.post('/changeEmailCode',async (req,res)=>{
    try{
        const {email}=req.body;

        const findUser=await User.findOne({email:email});
        
        if(findUser){
            return res.status(400).json({error:'User with that email already exists'})
        }

        
        const generateCode=crypto.randomInt(10000,99999).toString();

        const expiresAt = Date.now() + 10 * 60 * 1000;
        const html=
        `
        <div>         
            <h1>Here is your verification code:<br>${generateCode}<br></h1>
            <h2>
                Enter this code on web-site.
                If you did not request a code from the web-site, you can safely ignore this email.
            </h2>
        </div>
        `
        verificationCodes[email] = { generateCode, expiresAt };
        
        await sendEmailFunction(email,html,'Verify');
        res.status(200).json({success:'User Found'});

        
    }catch(error){
        console.log(error)
    }
})

app.post('/activete2FA/id/:id',async (req,res)=>{
    try{

        const {twoFAarg,id}=req.body;

        const findUser=await User.findById({_id:id});

        if(!findUser){
            return res.status(404).json({error:'USER NOT FOUND'})
        }

        const findUserAndUpdate=await User.findByIdAndUpdate({_id:id},{twoFA:twoFAarg},{new:true});

        if(findUserAndUpdate){

            return res.status(200).json({success:'Successfull request',res:twoFAarg});
        }
        
        return res.status(404).json({error:'ERROR'});

    }catch(error){
        console.log(error)
    }
})

app.post('/getUserAfterVerification',async (req,res)=>{
    try{
        const {email}=req.body;

        const findUser=await User.findOne({email});
        if(findUser){
            return res.status(200).json({success:'Login Successfull',email:findUser.email,userName:findUser.userName,id:findUser._id});
        }

        return res.status(404);

    }catch(error){
        console.log(error);
    }
})


startServer();
