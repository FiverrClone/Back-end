import {signUpValidation,signInValidation} from '../validation/authvalidation.js';
import {hashPassword, validatePassword,generateToken} from '../helpers/auth.js';
import UserHelper from "../helpers/UserHelper.js";

const userResolver = {
    Query:{
        user:async (_,{id},context)=> {
            if (!id.match(/^[0-9a-fA-F]{24}$/)){
                throw new Error(`404 NOT FOUND`);
            }

            const user = await context.models.User.findById(id);

            if(!user){
                throw new Error(`User with id ${id} does not exists.`);
            }

            return user;
            },
        users:async(_,args,context)=> await context.models.User.find(),
    },
    Mutation:{
        registerUser: async (_,args,context)=>{
            
            const {registerInput}=args;
            // See if an old user exists with email or username attempting to register
            
            const existingEmail=await context.models.User.findOne({email:registerInput.email});
            const existingUsername=await context.models.User.findOne({username:registerInput.username});

            if (existingEmail) {
                throw new Error('Email already exists');
              }
              
              if (existingUsername) {
                throw new Error('Username already exists');
              }
            //Input Validation
            const error = await signUpValidation(registerInput)
            if (error){
                throw new Error(error.details[0].message)
            }

            //Encrypt password

            const hashedPassword = await hashPassword(registerInput.password)

            //build out mongoose model(User)

            const newUser = new context.models.User({
                ...registerInput,
                password:hashedPassword
            })

            //Save our User in MongoDB

            const user = await newUser.save()
            return user
        },

        loginUser: async(_,args,context)=>{
            const {loginInput}=args
            
            //Input Validation

            const error = await signInValidation(loginInput)
            if (error){
                throw new Error(error.details[0].message)
            }

            //See if a user exists with the email

            const user= await context.models.User.findOne({email:loginInput.email})
            
            if(user.length===0){
                throw new Error("User does not exist")
            }

            //check if the entered password equals the encrypted password

            const passwordIsValid = await validatePassword(loginInput.password,user.password)
            if(!passwordIsValid){
                throw new Error("Password does not match")
            }

            //Create a New token

            const jwt=generateToken({
                email:user.email,
                id:user._id,
                role: user.role,
            })

            return{
                id:user._doc._id ,
                ...user._doc,
                token:jwt
            }

        },
        updateUser: async ( _, args, context) => {
            const {input}=args
            const id=context.user.id;
            const isExists = await UserHelper.isUserExists(id);
            if(!isExists){
                throw new Error(`User with id ${id} does not exists.`)
            
            }
            const user = await context.models.User.findOneAndUpdate({ _id: id }, input,{ new: true } );
            return {
                id:user.id ,
                ...user._doc, // return 1 if something is edited, 0 if nothing is edited
              message: 'User Edited.',

            };
          },

          deleteUser: async (_, args, context) => {
            const id=context.user.id;
            const isExists = await UserHelper.isUserExists(id);
            if(!isExists){
                throw new Error(`User with id ${id} does not exists.`)
            
            }
            const isDeleted = (await context.models.User.deleteOne({ _id: id })).deletedCount;
            return {
              status: isDeleted, // return true if something is deleted, 0 if nothing is deleted
              message: 'User deleted.',
            };
          },
    },
    User:{
        password(){
            return null;
        }
    }
}
export default userResolver