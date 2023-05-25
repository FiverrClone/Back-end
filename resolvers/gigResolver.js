import mongoose from "mongoose";
import * as dotenv from 'dotenv';
import  GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import {UploadImagesAndGetUrl,deleteBlobFromUrl} from '../config/azureStorage.js';

dotenv.config();


const gigResolver = {
    Upload : GraphQLUpload ,
    Query:{
        gig:async (_,{id},context)=> {
            if (!id.match(/^[0-9a-fA-F]{24}$/)){
                throw new Error(`404 NOT FOUND`);
            }
            
            const gig = await context.models.Gig.findById(id).populate('user');
            console.log(gig);
            if(!gig){
                throw new Error(`Gig with id ${id} does not exists.`);
            }

            return gig;
            },
        gigs:async(_,args,context)=> await context.models.Gig.find().populate('user'),
    },
    Mutation:{
        createGig: async (_,args,context)=>{

            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');

            const {title,description}=args;
            console.log(args)

            const blobUrl=await UploadImagesAndGetUrl(args.file,context);
            
            const newGig = new context.models.Gig({
                title,
                description,
                image:blobUrl,
                user:context.user.id
            }) ;
           
            //Save our User in MongoDB  
            
            const createdGig = await newGig.save();
            const user = await context.models.User.findById(new mongoose.Types.ObjectId(context.user.id));
            user.gigs.push(createdGig.id);
            await user.save();
            return {
                id:createdGig.id,
                ...createdGig._doc,
                user
            };
        },
        updateGig: async ( _, {id,file,input}, context) => {

            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');
            
            const fileurl=await UploadImagesAndGetUrl(file,context);

            const findgig = await context.models.Gig.findById({ _id: id });
            const imageUrl = findgig.image;
            
            const gig = await context.models.Gig.findOneAndUpdate({ _id: id }, {...input,image:fileurl},{ new: true } );

            await deleteBlobFromUrl(imageUrl);
            return {
                id:gig.id ,
                ...gig._doc,
            };
        },

        deleteGig: async (_, args, context) => {
            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');
            const {id}=args;
            console.log(id);
            await context.models.User.updateOne({_id : context.user.id }, {
                $pullAll: {
                    gigs: [{_id: id}],
                },
            });
            const gig = await context.models.Gig.findById({ _id: id });
            const imageUrl = gig.image;
            
            const isDeleted = (await context.models.Gig.deleteOne({ _id: id })).deletedCount;
            await deleteBlobFromUrl(imageUrl);
            return {
              status: isDeleted, // return true if something is deleted, 0 if nothing is deleted
              message: 'Gig deleted.',
            };
          },

    }
}
export default gigResolver; 