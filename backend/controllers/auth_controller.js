//include the hashing package
const bcrypt=require('bcryptjs');
const jwt = require("jsonwebtoken");
const config=require("../config/auth_config");
//including models
const User = require('../models/user');


exports.userSignup=async (req,res,next)=>{
    try{
        
        const name=req.body.name;
        const surname=req.body.surname;
        const email=req.body.email;
        const phone_number=req.body.phone_number;
        const _password=req.body._password;
        const gender =req.body.gender;
        const hashedPassword=await bcrypt.hash(_password,10);
        const forget_password_id= req.body.forget_password_id;
        const emailCheck=await User.findOne({where:{email:email}});

       if(emailCheck ){
            res.status(401).json({
                message:"There has been a user that use this email",
               
            })
        }else{
            User.create({
            name:name,
            surname:surname,
            email:email,
            phone_number:phone_number,
            _password:hashedPassword,
            gender:gender,
            forget_password_id:forget_password_id,
            
        }).then((result) => {
            res.status(201).json({
                message:"User has been added succesfully",
                result
               
            })
        }).catch((err) => {
            res.status(400).json({
                message:"User has not been added",
                err
               
            })
        });
        }
    }catch(err){
        console.log(err);
    }
}


exports.userLogin=async (req, res) => {
    // user signin using email and password bcrypt
    const {email, _password} = req.body;
     User.findOne( {where:{email:email}}).then(async user=>{
        if(!user){
            return res.status(404).json({
                message:"User has not found",
                
            })
        }
            const validPassword =  bcrypt.compareSync(_password, user._password);

            if (validPassword) {
                console.log("password is true");
                console.log("input mail:", email);
                console.log("database mail:", user.email);
                // generate jwt token for user
                const token =  jwt.sign({
                    
                    id:user.id,
                    email:user.email
                    
                    
                },config.secret,{
                    expiresIn:2592000
                });
                res.send({
                    "status" : "success",
                    "message": "User logged in successfully",
                    "token"  : token,
                    "data"   : user
                })
                return;
            }
            res.send({
                "status" : "error",
                "message": "Invalid email or password",
            })
        })
        
    
}
