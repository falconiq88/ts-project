
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'
import sendEmail from "../mailService/forgot-password";


async function forgotPassword(req,res){


    const {email}=req.body

    const user= await prisma.user.findFirstOrThrow({
        where:{
            email:email
        }
    }).catch(err=>{return res.send(err)})

    //generate 9 digit number for reset password token
    const token=Math.random().toString().slice(2,11);

     // Generate exipration time for forgot password
     const now =new Date();
     now.setMinutes(5+now.getMinutes());
    const tokenExpiration=now;



    // update or create
    await prisma.forgot_password.upsert({
        where: {
            email: email,
          },
          update: {
            token: token,
            expiresAt:tokenExpiration
          },
        create:{
            email:email,
            token:token,
            expiresAt:tokenExpiration
        }
    }).catch((err)=>{
      return  res.json({message:err})
    })


    await sendEmail(user.email, "Forgot Password",user.name,token);
  
    res.send("An Email sent to your email account");



    



}


async function resetPassword(req,res){

       const {token}=req.body

     const forgot=  await prisma.forgot_password.findFirstOrThrow({where:{token:token}})
       .catch((err)=>{
      return  res.json({message:err})
    })

     //convert date expiresAt to mileSeconds
     const date = new Date(forgot.expiresAt);
     const dateseconds = date.getTime()
     if(dateseconds > Date.now()){
      return  res.json({message:"success"})
     }
     else{
   return res.json({message:"your code has been expired"})
     }
}

async function updatePassword(req,res){

    const {token,Newpassword}=req.body

  const forgot=  await prisma.forgot_password.findFirstOrThrow({where:{token:token}})
       .catch((err)=>{
       return res.json({message:err})})

      const  salt = bcrypt.genSaltSync(10);
      const  hashedPassword = bcrypt.hashSync(Newpassword, salt);

        await prisma.user.update({where:{
            email:forgot.email
        },
        data:{
            password:hashedPassword
        }})

        res.json({message:"Your password has been reset successfuly"})

}








export {
   forgotPassword,
   resetPassword,
   updatePassword
};