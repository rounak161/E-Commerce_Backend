// import express from "express";
// import { getAllProductsController } from "../controllers/productController";
// import { isAuth } from "./../middlewares/authMiddleware.js";

// const router=express.Router();

// ///get all products
// router.get("/get-all",isAuth,getAllProductsController);


// export default router;
import express from "express";
import { isAdmin, isAuth } from "./../middlewares/authMiddleware.js";
import {
   
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductsController, getSinglePrroductController,  productReviewController, updateProductImageController,
   
} from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();


// GET ALL PRODUCTS
router.get("/get-all", getAllProductsController);

 // GET SINGLE PRODUCTS
router.get("/:id", getSinglePrroductController);

//CREATE Products 
// router.post("/create", isAuth,singleUpload,createProductController);
router.post("/create", isAuth, isAdmin,  singleUpload, createProductController);

//update imge 
router.put(
  "/image/:id",
  isAuth,isAdmin,
  singleUpload,
  updateProductImageController
);

// delete product image
router.delete(
  "/delete-image/:id",
  isAuth,isAdmin,
  deleteProductImageController
);
///DELETE PRODUCT IMAGE 
router.delete("/delete/:id",isAuth,isAdmin,deleteProductController)

// REVIEW PRODUCT
router.put("/:id/review", isAuth, productReviewController);


export default router;