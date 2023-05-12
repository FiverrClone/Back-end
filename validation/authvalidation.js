import Joi from 'joi';

export const signUpValidation= async (registerInput)=>{
    const userSchema=Joi.object({
        username:Joi.string().trim().required(),
        email:Joi.string().lowercase().trim().required(),
        password:Joi.string().required().min(8),
    }).options({allowUnknown: true});


    const {error}= await userSchema.validate(registerInput)
    return error;
}

export const signInValidation= async (loginInput)=>{
    const userSchema=Joi.object({
        email:Joi.string().lowercase().trim().required(),
        password:Joi.string().required().min(8)
    })

    const {error}= await userSchema.validate(loginInput)
    return error;
}
