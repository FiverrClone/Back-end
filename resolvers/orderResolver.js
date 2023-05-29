import mongoose from "mongoose";

const orderResolver = {

    Query:{
        orders: async(_,args,context)=>{

            if (!context.user) return new Error('User not Authenticated') ;

            const orders=await context.models.Order.find({customer:context.user.id})
            .populate('freelancer', 'username')

            return orders;
            
        }
          
    },
    Mutation:{
        createOrder: async(_,args,context)=>{
            const {gigId}=args
            console.log(gigId)
            if (!context.user) return new Error('User not Authenticated') ;
            const gig =await context.models.Gig.findById(gigId);
            const newOrder = new context.models.Order({
                gig:gig.id,
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
                id:createdOrder.id,
                ...createdOrder._doc,
                customer:customer._doc,
                freelancer:freelancer._doc,
                gig
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