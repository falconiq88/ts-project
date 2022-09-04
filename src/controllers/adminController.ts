import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import bcrypt from 'bcryptjs';

import { RegisterSchema } from "../Request/RegisterSchema"; 
import { updateUserSchema } from "../Request/updateUserSchema";  



// add new user 
async function AddNewUser(req, res) {
      // validation
       
      const { body } = req;  
      const result = RegisterSchema.validate(body); 
      const { value, error } = result; 
      const valid = error == null; 

     if(!valid){ return res.status(422).json(error['details'])}
     //end validation
   
    const alreadyExist=await prisma.user.findFirst({where:{email:value["email"]}}).catch(err=>{return res.send("error is :"+err)})

     if(alreadyExist){

    return res.json({message:"User already exist"})
     }
  
    const  salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(value['password'], salt);
     const dateNow = new Date(Date.now());
  await prisma.user.create({
         data: {
           name: value['name'],
           email:value['email'],
           password:hashedPassword,
           verified_at:dateNow,
           profile:{
            create:{
            bio:value['bio']
            }
          }
         },
   }).catch(async()=>{
     await prisma.$disconnect()
    return res.status(500).json({message:'error try again later'})
     
    
   }).then(async () => {
     await prisma.$disconnect()
     res.json({message:'user has been registered'})
   })

   
 

 }

 // all users 
 async function allUsers(req,res){
     //hide password from the query
    const users = await prisma.user.findMany({ select: {
        password: false,
        id:true,
        name:true,
        email:true,
        verified_at:true,
        role:true
      }}).catch(async()=>{
        await prisma.$disconnect()
       return res.json({message:'error try again later'})
        
       
      })

      res.json({data:users});
 }

// get specific user
 async function getUser(req,res){

     const id=parseInt(req.params.id);
    
          if(Number.isInteger(id)){

   const user=await prisma.user.findFirstOrThrow({
    where:{
        id:id
    },
    select: {
    password: false,
    id:true,
    name:true,
    email:true,
    role:true,
    verified_at:true
  }}).catch(()=>{return res.send("user not found")})

  
    return res.json({data:user});
   
          }

          else return res.json({message:"integer required"})

 }


// update user
async function updateUser(req,res){

       // validation
       
       const { body } = req;  
       const result = updateUserSchema.validate(body); 
       const { value, error } = result; 
       const valid = error == null; 

      if(!valid){ return res.status(422).json(error['details'])}
      //end validation
    
   
  

    const id=parseInt(req.params.id);
    
    if(Number.isInteger(id)){

        const updateUser = await prisma.user.update({
            where: {
              id: id,
            },
            data: {
              name: value['name'],
              email:value['email'],
              role:value['role'],
            },
            select:{
                id:true,
                name:true,
                email:true,
                role:true
            }
          }).catch(()=>{res.send("not found")})

       return  res.json({message:"success",data:updateUser})
          

    }

    else{
      return  res.json({message:"id integer required"})
    }
}

async function deleteUser(req,res){

    const id=parseInt(req.params.id);
    
    if(Number.isInteger(id)){

         await prisma.user.delete({
            where: {
              id: id,
            }
          }).catch((err)=>{
          return  res.json({message:"not valid : "+err})
          })

        return  res.json({message:"user has been deleted successfully"})

    }
    else{
     return   res.json({message:"id integer required"})
    }




}









 export   {
    AddNewUser,
    allUsers,
    getUser,
    updateUser,
    deleteUser
};


