// import userModel from "../models/userModel.js";
// import JWT from "jsonwebtoken";
//user auth 
// export const isAuth=async (req,res,next)=>{
//     const{token}=req.cookies;
//     if(!token){
//         return res.stauts(500).send({
//             success: false,
//             message: "UnAuthorized User",
//         })
//     }
//    const decodeData=JWT.verify(token,process.env.JWT_SECRET);
//    req.user=await userModel.findById(decodeData._id);
//    next();
    
// }
// export const isAuth = async (req, res, next) => {
//     const { token } = req.cookies;
//     //valdiation
//     if (!token) {
//       return res.status(401).send({
//         success: false,
//         message: "UnAuthorized User",
//       });
//     }
//     const decodeData = JWT.verify(token, process.env.JWT_SECRET);
//     req.user = await userMdoel.findById(decodeData._id);
//     next();
//   };
import JWT from "jsonwebtoken";
import userMdoel from "../models/userModel.js";

// USER AUTH
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // console.log("Reached")
  //valdiation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userMdoel.findById(decodeData._id);
  next();
};


//Admin Auth 
export const isAdmin=async(req,res,next)=>{
  if(req.user.role!=="admin"){
    return res.status(401).send({
      success:false,
      message:"admin only",
    })
  }
  next();
}