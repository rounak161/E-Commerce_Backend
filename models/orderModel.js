// import mongoose from "mongoose";
// const orderSchema=new mongoose.Schema(
// {
//         shippingInfo:{
//                 address:{
//                     type:String,
//                     recquired:[true,"address is recquired"]
//                 },
//                 city:{
//                     type:String,
//                     recquired:[true,"city is recquired"]
//                 },
//                 country:{
//                     type:String,
//                     recquired:[true,"country is recquired"]
//                 }
//         },
//         orderItems:[
//         {
//             name:{
//                 type:String,
//                 recquired:[true,"name is recquired"]
//             },
//             price:{
//                 type:String,
//                 recquired:[true,"price is recquired"]
//             },
//             quantity:{
//                 type:String,
//                 recquired:[true,"quantity is recquired"]
//             },
//             image:{
//                 type:String,
//                 recquired:[true,"product image is recquired"]
//             },
//             product:{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:"Products",
//                 recquired:true,
//             }


//        }
       
//     ],
//     PaymentMethod:{
//         type:String,
//          enum:["COD","ONLINE"],
//          default:"COD"
//     },
//     user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Users",
//         recquired:[true,"user id is recquired"]
//     },
//     paidAt:Date,
//     paymentInfo:{
//         id:String,
//         status:String,
//     },
//     itemPrice:{
//         type:Number,
//         recquired:[true,"itemPrice is recquired"]
//     },
//     tax:{
//         type:Number,
//         recquired:[true,"tax Price is recquired"]
//     },
//     shippingCharges:{
//         type:Number,
//         recquired:[true,"Shipping Charge is recquired"]
//     },
//     totalAmount:{
//         type:Number,
//         recquired:[true,"Shipping Charge is recquired"]
//     },
//     orderStatus:{
//         type:String,
//         enum:["processing","shipped","delivered"],
//         default:"processing"
//     },
//     deliveredAt:Date,


// },{timestamps:true}
// )
// export const orderModel=mongoose.model("Orders",orderSchema);
// export default orderModel;
 


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "address is required"],
      },
      city: {
        type: String,
        required: [true, "city name is required"],
      },
      country: {
        type: String,
        required: [true, " country name is require"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "product name is require"],
        },
        price: {
          type: Number,
          required: [true, "product price is require"],
        },
        quantity: {
          type: Number,
          required: [true, "product quantity is require"],
        },
        image: {
          type: String,
          required: [true, "product image is require"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user id is require"],
    },
    paidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "item price is require"],
    },
    tax: {
      type: Number,
      required: [true, "tax price is require"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "item shippingCharges  is require"],
    },
    totalAmount: {
      type: Number,
      required: [true, "item totalAmount price is require"],
    },
    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "deliverd"],
      default: "processing",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("Orders", orderSchema);
export default orderModel;