
  import Joi from "joi";

const  updateUserSchema = Joi.object().keys({ 
  name: Joi.string().required(),
  email: Joi.string().required().email(), 
  password: Joi.string().min(6).alphanum().required(),
  role:Joi.string().valid('user','admin').required()
});




 export {
    updateUserSchema
  }
