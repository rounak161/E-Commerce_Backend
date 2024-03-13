import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";


// GET ALL PRODUCTS
export const getAllProductsController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products=await productModel.find({});
    res.status(200).send({
      success: true,
      message: "all products fetched successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Products API",
      error,
    });
  }
};


//get single product
export const getSinglePrroductController=async (req,res)=>{
  try{
    const product=await productModel.findById(req.params.id);
    if(!product){
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product Found",
      product,
    });
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
      message: "Error In Get single Products API",
      error,
    });
  }
}



 
// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const { name, description, price,  stock } = req.body;
    // // validtion
    // if (!name || !description || !price || !stock) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "Please Provide all fields",
    //   });
    // }
    if (!req.file) {
      return res.status(500).send({
        success: false,
        message: "please provide product images",
      });
     }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    await productModel.create({
      name,
      description,
      price,
      stock,
       images: [image],
    });

    res.status(201).send({
      success: true,
      message: "product Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get single Products API",
      error,
    });
  }
};

//update product
export const updateProductController=async(req,res)=>{
  try{
     const product=await productModel.findById(req.params.id);
     if(!product){
      return res.status(500).send({
          success:false,
          message:"Product Not Found"
      })
     }
     const {name,description,price,stock}=req.body;
     if(name) product.name=name;
     if(description) product.description=description;
     if(price) product.price=price;
     if(stock) product.stock=stock;
     await product.save();
     res.status(200).send({
      success:true,
      message:"product details updated successfully"
     })
     
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get single Products API",
      error,
    });
  }
}

//update product image 
export const   updateProductImageController=async(req,res)=>{
  try{
     const product=await productModel.findById(req.params.id);
     if(!product){
      return res.status(500).send({
          success:false,
          message:"Product Not Found"
      })
     }
     if(!req.file){
      return res.status(500).send({
       success:false,
       message:"give product image "
      })
     }
     const file=getDataUri(req.file);
     const cdb=await cloudinary.v2.uploader.upload(file.content);
      const image={
        public_id:cdb.public_id,
        url:cdb.secure_url
      }
      product.images.push(image);
      await product.save();
      res.status(200).send({
        success:true,
        message:"product image updated"
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
      message: "Error In Get single Products API",
      error,
    });
  }
}
//delete product image 
export const deleteProductImageController=async (req,res)=>{
  try{
    const product =await productModel.findById(req.params.id);
    if(!product){
      return res.status(500).send({
        success:true,
       message:"Product Not Found"
      })
    }
    const id=req.query.id;
    if(!id){
      return res.status(404).send({
        success: false,
        message: "product image not found",
      });
    }
    let isExist=-1;
    product.images.forEach((item,index)=>{
        if(item._id.toString()===id.toString()) isExist=index;
    })
    if(isExist<0){
      return res.status(404).send({
        success: false,
        message: "Image Not Found",
      });
    }
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist,1);
    await product .save();
    return res.status(200).send({
      success: true,
      message: "Product Image Dleteed Successfully",
    });
  }
  catch(error){
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
      message: "Error In Get single Products API",
      error,
    });
  }
}
 
 
//DELETE PRODUCT  
export const deleteProductController=async (req,res)=>{
  try{
    const product=await productModel.findById(req.params.id);
    if(!product){
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }
    for(let index=0;index<product.images.length;index++){
      await  cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success:true,
      message:"Product Deleted Successfully",
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
          message: "Error In Get DELETE Product IMAGE API",
          error,
        });
  }
}


/// create product review 
export const productReviewController=async (req,res)=>{
 try{
  const {comment,rating}=req.body;
  const product=await productModel.findById(req.params.id);
  const alreadyReviewed=product.reviews.find(
    (r)=>r.user.toString() === req.user._id.toString()
  )
   if(alreadyReviewed){
    return res.status(500).send({
      success:false,
      message:"product  already reviewed"
    })
   }
   const review={
    name:req.user.name,
    rating:Number(rating),
    comment,
    user:req.user._id,
   }
   product.reviews.push(review);
   product.numReviews=product.reviews.length;
   product.rating=
   product.reviews.reduce((acc, item) => item.rating + acc, 0) /
   product.reviews.length;

   await product.save();
   await product.save();
   res.status(200).send({
     success: true,
     message: "Review Added!",
   });
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
    message: "Error In Review Comment API",
    error,
  });
 }
}


  