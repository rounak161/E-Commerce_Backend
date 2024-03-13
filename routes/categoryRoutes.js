import express from "express";
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from "../controllers/categoryController.js";
import { isAdmin,isAuth } from "./../middlewares/authMiddleware.js";
 
const router=express.Router();

//CREATE THE PRODUCT CATEGORY
 router.post("/create",isAuth,isAdmin,createCategory);

// GET ALL CATEGORY
router.get("/get-all", getAllCategoriesController);


//DELETE CATEGORY
router.delete("/delete/:id", isAuth,isAdmin,deleteCategoryController);


// UPDATE ALL CATEGORY
router.put("/update/:id", isAuth ,isAdmin,updateCategoryController);

export default router;

 