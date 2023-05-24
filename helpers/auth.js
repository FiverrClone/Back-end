import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const hashPassword = async(passwordInput)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(passwordInput,salt)

    return hashedPassword
}

export const validatePassword = async (passwordInput,hashedPassword)=>{
    const passwordIsValid = await bcrypt.compare(passwordInput,hashedPassword) 
    
    return passwordIsValid;
}

export const generateToken = async (user)=>{
    const token = jwt.sign(user,process.env.PRIVATE_KEY,{
        expiresIn:"2h"
    }); 
    
    return token;
}

export const getUserFromJWT = (token) => {
    try {
      const user = jwt.verify(token, process.env.PRIVATE_KEY);
      return user;
    } catch (error) {
      return null;
    }
  };
