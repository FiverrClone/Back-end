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
            
            const gig = await context.models.Gig.findById(id).populate('reviews user');
            if(!gig){
                throw new Error(`Gig with id ${id} does not exists.`);
            }

            return gig;
            },
        gigByUser:async(_,args,context)=>{

            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');
            const gigs=await context.models.Gig.find({user:context.user.id}).populate('user','username')
            console.log(gigs)
            return gigs;
        },
        gigByCategory:async(_,{category},context)=>{
            return await context.models.Gig.find({category:category}).populate('user, username');
        },
        gigs:async(_,args,context)=> {
             const gigs=await context.models.Gig.find().populate('user');
             console.log(gigs.user)
             return gigs;
            }
    },
    Mutation:{
        createGig: async (_,args,context)=>{

            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');
            const {input}=args
            // const {title,description,category,price}=args;
           console.log(args.file)
            const blobUrl=await UploadImagesAndGetUrl(args.file,context);
            
            const newGig = new context.models.Gig({
                title:input.title,
                description:input.description,
                category:input.category,
                price:input.price,
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
        updateGig: async ( _, {id,input}, context) => {

            if (!context.user) return new Error('User not Authenticated') ;
            if(!context.user.role.includes('FREELANCER')) return new Error('User not Authorized');
            console.log({file:input.file})
            const fileurl=await UploadImagesAndGetUrl(input.file,context);

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

            // Find the gig to delete
            const gig = await context.models.Gig.findById({ _id: id });
            if (!gig) {
                throw new Error('GIG not found');
            }
            // const gig = await context.models.Gig.findById({ _id: id });
            const imageUrl = gig.image;
                        
            // Check if the authenticated user is the owner of the gig
            if (gig.user.toString() !== context.user.id) {
                throw new Error('Unauthorized: User is not the owner of the review');
            }
            console.log(gig.id);
            await context.models.User.updateOne({_id : context.user.id }, {
                $pullAll: {
                    gigs: [{_id: gig.id}],
                },
            });


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