import mongoose from "mongoose";
import stripe from 'stripe';
import { origin } from "../config/stripe.js";
const secretKey = process.env.SECRET_KEY_STRIPE;
const stripee = new stripe(secretKey)
import * as dotenv from 'dotenv';
dotenv.config();

const orderResolver = {

    Query:{
        orders: async(_,args,context)=>{

            if (!context.user) return new Error('User not Authenticated') ;

            const orders=await context.models.Order.find({customer:context.user.id})
            .populate('freelancer', 'username')
            .populate('customer', 'username') 

            return orders;
            
        }
          
    },
    Mutation:{
        createOrder: async(_,args,context)=>{
            const {gigId}=args
            
            if (!context.user) return new Error('User not Authenticated') ;
            const gig =await context.models.Gig.findById(gigId);
            const session=await stripee.checkout.sessions.create({
                line_items:[{
                    price_data:{
                        currency:'usd',
                        product_data:{
                            name:gig.title,
                            images:[gig.image]
                        },
                        unit_amount:gig.price*100,
                    },
                    quantity:1
                }],
                mode:"payment",
                success_url: `${origin}/profile`,
                cancel_url: `${origin}/home`,
            })
            const newOrder = new context.models.Order({
                gig:gigId,
                title:gig.title,
                price:gig.price,
                freelancer:gig.user,
                customer:context.user.id
            }) ;
            
            const createdOrder = await newOrder.save();

            const freelancer = await context.models.User.findById(new mongoose.Types.ObjectId(gig.user));
            freelancer.orders.push(createdOrder.id);
            await freelancer.save();

            const customer = await context.models.User.findById(new mongoose.Types.ObjectId(context.user.id));
            customer.orders.push(createdOrder.id);
            await customer.save();

            return {
                id: session.id,
                url: session.url,
            };
            
        },
        updateOrderStatus: async (_, { id, status },context) => {
                const order = await context.models.Order.findById(id);
                order.status = status;
                const result = await order.save();
                return { 
                    ...result._doc,
                     id: result._id };
        }
    }
}
export default orderResolver;  