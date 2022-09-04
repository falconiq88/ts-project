

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { RegisterSchema } from "../Request/RegisterSchema"; 
import { LoginSchema } from "../Request/LoginSchema"; 
import { verifySchema } from "../Request/verifySchema";
import sendEmail from "../mailService/email";
import crypto from "crypto";



//For Register Page

    async function Register(req, res) {

      // validation
       
       const { body } = req;  
       const result = RegisterSchema.validate(body); 
       const { value, error } = result; 
       const valid = error == null; 

      if(!valid){ return res.status(422).json(error['details'])}
      //end validation

       const alreadyExist=await prisma.user.findFirst({where:{email:value['email']}}).catch(err=>{ return res.send(err)})

        if(alreadyExist){

       return res.json({message:"User already exist"})
        
                       }
      
      // hashing password
      const   salt =await bcrypt.genSaltSync(10);
      const  hashedPassword =await bcrypt.hashSync(value['password'], salt);
     //create user
     await prisma.user.create({
            data: {
              name: value['name'],
              email:value['email'],
              password:hashedPassword,
              profile:{
                create:{
                bio:value['bio']
                }
              }
              
            },
      }).catch(async()=>{
        await prisma.$disconnect()
       return  res.json({message:'error try again later'})
        
       
      }).then(async () => {
        await prisma.$disconnect()
      return  res.json({message:'user has been registered'})
      })
      
    
  
    }
   
    
   

// For Login
async function Login(req, res,next) {
    // validation
       
    const { body } = req;  
    const result = await LoginSchema.validate(body); 
    const { value, error } = await result; 
    const valid = error == null; 

   if(!valid){ return res.status(422).json(error['details'])}
   //end validation
   
    await prisma.user.findFirstOrThrow({ where:{email:value['email']}}).catch((err)=>{
      return next(err)
       })
.then(async (User)=>{


  const cmp =await bcrypt.compare( value['password'], User.password);
  console.log(cmp)
  if (!cmp) {return  res.json("Wrong username or password.") } 


   const jwtToken =await jwt.sign(
    { id: User.id, email: User.email },
    process.env.JWT_SECRET,
     {
      expiresIn: '24h' // expires in 1 day
     }
  )
  
 res.json({ message: "Welcome Back!", token:"Bearer "+ jwtToken });


})
    
     

        

}

// change password for authenticated user
async function changePassword(req,res){

const {oldPassword,newPassword}=req.body

const cmp = await bcrypt.compare(oldPassword, req.user.password);
if (cmp) {
 
const  salt = bcrypt.genSaltSync(10);
const  hashedPassword = bcrypt.hashSync(newPassword, salt);

  await prisma.user.update({where:{id:req.user.id},data:{password:hashedPassword}}).catch((err)=>{
    return  res.status(500).json({message:"error :"+err})
  })

 return res.status(200).json({ message: "Success" });
}

return res.json({message:"The old password not correct"})




}

// send verificatin link to user email

async function SendVerification(req, res) {
 // Generate exipration time for verification token
  const now =new Date();
  now.setMinutes(20+now.getMinutes());
 const tokenExpiration=now;


    // update or create token
  const token=  await prisma.token.upsert({
      where: {
        userId:req.user.id
        },
        update: {
          token:crypto.randomBytes(32).toString("hex"),
          expiresAt:tokenExpiration
        },
      create:{
         userId:req.user.id,
          token:crypto.randomBytes(32).toString("hex"),
          expiresAt:tokenExpiration
      }
  }).catch((err)=>{
    return  res.json({message:err})
  })




      const VerificationUrl = `${process.env.BASE_URL}/api/v1/user/verify/${req.user.id}/${token.token}`;
      await sendEmail(req.user.email, "Verify Email", VerificationUrl,req.user.name);
    
      return  res.send("An Email sent to your account please verify");
  }
 




async function Verify(req, res,next) {
 
  // validation
       
  const { params } = req;  
  const result = verifySchema.validate(params); 
  const { value, error } = result; 
  const valid = error == null; 

 if(!valid){ return res.status(422).json(error['details'])}
 //end validation
      
          const id=value['id']
          const token=value['token'];
         
          const User=await prisma.user.findFirst({ where:{id:id},  include: {
            token: true,
          },})
            
          if(checkTokenexist(req,res,User,token)==true)
          {
          const dateNow = new Date(Date.now());
        
         
        await  prisma.user.update( { where: {
            id: User.id,
          },
          data: {
            verified_at:dateNow
          }}).catch(err=>{return res.send(err)})

         await  prisma.token.delete({where:{id:User.token.id}}).catch((err)=>{
           return res.json({message:err})
           })

         return res.json({message:"user has been verified"})
        
        }


         
      
}

// function to validate user and token if its expired

 function checkTokenexist(req,res,User,token){
  //
if(User && User.token){
  
    //convert date expiresAt to mileSeconds
    const date = new Date(User.token.expiresAt);
    const dateseconds = date.getTime()

    // checking user token if its valid
  if(User.token.token==token && dateseconds > Date.now()){
    return true
  }
  else{return res.json({message:"invalid credantials"})}
}
else {return res.json({message:"not found"})}

}

export   {
    Register,
    Login,
    changePassword,
    Verify,
    SendVerification
};