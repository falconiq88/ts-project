import Joi from "joi";

const  LoginSchema = Joi.object().keys({ 
  email: Joi.string().required().email(), 
  password: Joi.string().min(6).alphanum().required()
});


export {LoginSchema};