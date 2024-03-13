// import mongoose from "mongoose";


// const categorySchema= new mongoose.Schema(
// { 
//     category:{
//         type:String,
//         recquired:[true,'category is recquired'],
//     }
     
// },
// {timestamps:true}
// );
// export const categoryModel=mongoose.model("Category",categorySchema);
// export default categoryModel;
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "category  is required"],
    },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;