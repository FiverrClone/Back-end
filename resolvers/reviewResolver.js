import mongoose from "mongoose";

const reviewResolver = {

    Query:{
        reviewsbyGig: async(_,args,context)=>{
            const {gig}=args
            return await context.models.Review.find({gig:gig}).populate('user');
        }
          
    },
    Mutation:{
        createReview: async(_,args,context)=>{
            const {input}=args

            if (!context.user) return new Error('User not Authenticated') ;
            const newReview = new context.models.Review({
                ...input,
                user:context.user.id
            }) ;
            const createdReview = await newReview.save();
            const user = await context.models.User.findById(new mongoose.Types.ObjectId(context.user.id));
            user.reviews.push(createdReview.id);
            await user.save();

            const gig = await context.models.Gig.findById(new mongoose.Types.ObjectId(input.gig));
            gig.reviews.push(createdReview.id);
            await gig.save();

            return {
                id:createdReview.id,
                ...createdReview._doc,
                user
            };
        },
        deleteReview: async ( _, {id}, context) => {

            if (!context.user) return new Error('User not Authenticated') ;
              // Find the review to delete
            const review = await context.models.Review.findById(id);
            if (!review) {
                throw new Error('Review not found');
            }
            // Check if the authenticated user is the owner of the review
            if (review.user.toString() !== context.user.id) {
                throw new Error('Unauthorized: User is not the owner of the review');
            }
            await context.models.User.updateOne({_id : context.user.id }, {
                $pullAll: {
                    reviews: [{_id: review.id}],
                },
            });

            await context.models.Gig.updateOne({_id : review.gig }, {
                $pullAll: {
                    reviews: [{_id: review.id}],
                },
            });

            const isDeleted = (await context.models.Review.deleteOne({ _id: id })).deletedCount;
            return {
              status: isDeleted, // return true if something is deleted, 0 if nothing is deleted
              message: 'Review deleted.',
            };
        },
    }
}
export default reviewResolver; 