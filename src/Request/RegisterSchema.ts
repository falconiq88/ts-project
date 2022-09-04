import Joi from "joi";

const  RegisterSchema = Joi.object().keys({ 
  name: Joi.string().required(),
  email: Joi.string().required().email(), 
  password: Joi.string().min(6).alphanum().required(),
  bio:Joi.string().max(24).required()
});


export {RegisterSchema};