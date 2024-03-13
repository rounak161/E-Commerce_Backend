
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";
 

// CREATE ORDERS
export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;
    //valdiation
    // create order
    await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod,
      paymentInfo,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });

    // stock update
    for (let i = 0; i < orderItems.length; i++) {
      // find product
      const product = await productModel.findById(orderItems[i].product);
      product.stock -= orderItems[i].quantity;
      await product.save();
    }
    res.status(201).send({
      success: true,
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
};

//GET ALL ORDERS I.E MY ALL ORDERS
export const getMyOrdersCotroller=async(req,res)=>{
    try{
       const orders=await orderModel.find({user:req.user._id});
       if(!orders){
        return res.status(500).send({
            success:false,
            message:"No orders found",
            
        })
       }
       res.status(200).send({
        success:true,
        message:"your orders data",
        totalOrders:orders.length,
        orders
       })

    }catch(error){
     console.log(error);
     res.status(500).send({
      success: false,
      message: "Error In My orders Order API",
      error,
     });
    }
} 

//GET SINGLE ORDER INFO
export const singleOrderDetrailsController=async(req,res)=>{
    try{
        const order=await orderModel.findById(req.params.id);
        if(!order){
            return res.status(404).send({
                success:false,
                message:"no order found"
            })
        }
        res.status(200).send({
            success:true,
            message:"your order fetched",
            order
        })
    }catch(error){
        if (error.name === "CastError") {
            return res.status(500).send({
              success: false,
              message: "Invalid Id",
            });
          }
          res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
          });
    }
}

//ACCEPT PAYMENTS
// ACCEPT PAYMENTS
export const paymetsController = async (req, res) => {
  try {
    // get ampunt
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};



//ADMIN SECTION
//GET ALL ORDERS
export const  getAllOrdersController=async(req,res)=>{
try{
   const orders=await orderModel.find({});
   res.status(200).send({
    success:true,
    message:"ALL ORDERS DATA",
    totalOrders:orders.length,
    orders,
   })
}catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
}
}

//CHANGES ORDER STATUS
export const changeOrderStatusController=async (req,res)=>{
    try{
        const order=await orderModel.findById(req.params.id);
        if(!order){
            return res.status(500).send({
                success:false,
                message:"order not found "
            })
        }
        if(order.orderStatus === "processing ") order.orderStatus="shipped";
        else if(order.orderStatus === "shipped"){
            order.orderStatus="deliverd";
            order.deliverdAt=Date.now();
        }else{
            return res.status(500).send({
                success:false,
                message:"order  already delivered"
            })
        }
        await order.save();
        res.status(200).send({
            success:false,
            message:"Invalid Id"
        })

    }catch(error){
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
              success: false,
              message: "Invalid Id",
            });
          }
        res.status(500).send({
          success: false,
          message: "Error In Get UPDATE Products API",
          error,
        });
    }
}


 