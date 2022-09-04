
import Joi from "joi";

const  verifySchema = Joi.object().keys({ 
  id: Joi.number().required().id(), 
  token: Joi.string().token().required()
});




  export{
    verifySchema
  }
