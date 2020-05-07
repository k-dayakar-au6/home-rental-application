const bcrypt = require('bcryptjs')
const User = require('../model/user')
const Post = require('../model/posts')
const Project = require('../model/projects')
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")
dotenv.config()

const transportOption = {
    service: "gmail",
    secure: false,
    debug: process.env.NODE_ENV ==="development",
    auth:{
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
}



const apicontrollers = {}
//@route POST api/users
//@desc  Register new user
//@access public
apicontrollers.registeruser = async(req,res)=>{
    let user = new User(req.body)
//@simple validation
    if(!user.firstname || !user.lastname || !user.email || !user.password){
        return res.status(400).json({message:"please enter all fields"})
    }
//@duplicate email validation
    User.findOne({email:user.email})
    .then(user =>{
        if(user) {
            res.status(400).json({message:"email already exist"})
        }
    })
    .catch(function(err){
        console.log(err)
    })      
        const email = user.email
        const secretkey = `${user.email}-${new Date(user.createAt).getTime()}`
        const token = jwt.sign({_id:user._id},secretkey,{expiresIn:(1000*60*10).toString()})
        const domainname = process.env.DOMAIN_NAME || `http://localhost:3000`
        const html =  `<p> Welcome to Home renting app</p>
                        <h5>Click <a href="${domainname}/api/confirmemail/${token}">here</a></h5>
                        <h5> Or Copy ${domainname}/api/confirmemail,${token} in to your browser.<h5>
                        `
    
        const mailtransport = nodemailer.createTransport(transportOption)
        mailtransport.sendMail({
            from: "dayakars23@gmail.com",
            to: email ,
            subject:"Home-renting application",
            html:html
        })
   
        user.confirmtoken = token
        user.save()
        .then(function(user){
            if(user){
                res.status(200).json({message:"user registered successfully check your mail for confirmation"})
            }
            
        })
        .catch(function(err){
            console.log(err)
        });
}

apicontrollers.verifyemailtoken = function(req,res){
     User.findOne({confirmtoken:req.params.token})
     .then(function(user){
         if(user){
             console.log(user)
            const secretkey = `${user.email}-${new Date(user.createAt).getTime()}`
            console.log(secretkey)
            const payload = jwt.verify(req.params.token,secretkey)
            console.log(payload)
            if(payload){
                user.confirmtoken = " "
                user.isConfirmed = true
                user.save()
                res.status(200).json({message:"verified successfully"})
            }
            console.log(err.message)
         }
     })
     .catch(function(err){
         res.status(500).json(err.message)
     })
}


apicontrollers.loginuser = function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(function (user) {
            bcrypt.compare(password, user.password)
                .then(function (result) {
                    if (result) {
                        req.session.userId = user._id;
                        console.log(req.session.userId)
                        return res.status(200).json({message:"you logged in"})
                    };
                    res.status(500).json({message:"incorrect credentials"})
                })
        })
        .catch(function (err) {
            console.log(err)
        })
}


 apicontrollers.changepassword = function(req,res){
        const email = req.body.email
        const oldPassword = req.body.oldPassword
        const newPassword = req.body.newPassword
        if (!email || !oldPassword || !newPassword)
          return res.status(404).send("Bad request");
          User.findOne({email:email})
          .then(function(user){
            if(user){
                bcrypt.hash(newPassword,10)
                .then(function(hashpassword){
                    User.updateOne({email:email},{$set:{password:hashpassword}})
                    res.status(200).json({message:"password updated"})
                })
               
            }
              
          })        
}


apicontrollers.deactivateAccount= function(req,res){
    const{email} = req.body
    if(!email) return res.status(400).json({message:"Email id is required"})
    User.deleteOne({email:email})
    .then(function(success){
        if(success) return res.status(200).json({message:"Account successfully removed"})
    })
    .catch(function(err){
        console.log(err)
    })
}


apicontrollers.logoutuser = function (req, res) {
    req.session.destroy();
    res.status(200).json({message:"logout succesfully"});
}



 apicontrollers.sendforgotpasswordmail = function(req,res){
     const email = req.body.email
     if(!email){
         return res.status(404).json({message:"email must be required"})
     }

     User.findOne({email:email})
     .then(function(user){
         if(user){
            const secretkey = `${user.email}-${new Date(user.createAt).getTime()}`
            const token = jwt.sign({_id:user._id},secretkey,{expiresIn:(1000*60*10).toString()})
            const domainname = process.env.DOMAIN_NAME || `http://localhost:3000`
            const html =  `<p> Welcome to Home renting app</p>
                            <h5>Click <a href="${domainname}/api/checkforgotpassword/${token}">here</a></h5>
                            <h5> Or Copy ${domainname}/api/checkforgotpassword/${token} in to your browser.<h5>
                            `
        
            const mailtransport = nodemailer.createTransport(transportOption)
            mailtransport.sendMail({
                from:"home-renting application",
                to: email ,
                subject:"Home-renting application",
                html:html
            })
       
            user.resettoken  = token
            user.save()
            res.status(200).json({message:"reset link sended to your email"})
            
         }
     }).catch(function(err){
         console.log(err)
         res.status(400).json({message:"internal server error"})
     })
 }   




 apicontrollers.checkforgotpassword = function(req,res){
     const newpassword = req.body.newpassword
     User.findOne({resettoken:req.params.token})
     .then(function(user){
         if(user){
            const secretkey = `${user.email}-${new Date(user.createAt).getTime()}`
            const payload = jwt.verify(req.params.token,secretkey)
            if(payload){
                user.resettoken = " "
                user.password = newpassword
                user.save()
                res.status(200).json({message:"your password changed try to login"})
            }
            if(err.name === "TokenExpiryError"){
                res.status(400).json({message:"link has been expired"})
            }
            console.log(err.message)
         }
     })
     .catch(function(err){
         res.status(500).json(err.message)
     })

 }
 apicontrollers.yourposts = function(req,res){
     const userid = req.session.userId
     Post.find({user:userid})
     .then(function(data){
         if(data){
             res.status(200).json(data)
         }
     })
     .catch(function(err){
         console.log(err)
         res.status(500).json({message:err.message})
     })
     
 }

 apicontrollers.yourprojects = function(req,res){
     const userid = req.session.userId
     Project.find({user:userid})
     .then(function(data){
         if(data){
             res.status(200).json(data)
         }
     })
     .catch(function(err){
         console.log(err)
         res.status(500).json(err.message)
     })

 }





   

module.exports = apicontrollers;
