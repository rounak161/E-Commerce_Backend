
import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
export const registerController=async (req,res)=>{
    try{
        const{name,email,password,address,city,country,phone,answer}=req.body;
        if (
            !name ||
            !email ||
            !password ||
            !city ||
            !address ||
            !country ||
            !phone ||
            !answer
          ) {
            return res.status(500).send({
                sucess:false,
                message:"please provide all fields"
            })
        }
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(500).send({
                success:false,
                message:"email already taken"
            })
        }
        const user=await userModel.create({
             name,  
             email , 
             password,  
             city , 
             address ,
             country , 
             phone,  
             answer
        })
        res.status(200).send({
            success:true,
            message:"Registration Success,please login",
            user
        })

    }catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In Register API",
          error,
        });
      }
};

 
 //Login
 export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(500).send({
          success: false,
          message: "Please Add Email OR Password",
        });
      }
      // check user
      const user = await userModel.findOne({ email });
      //user valdiation
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "USer Not Found",
        });
      }
      //check pass
      const isMatch = await user.comparePassword(password);
      //valdiation pass
      if (!isMatch) {
        return res.status(500).send({
          success: false,
          message: "invalid credentials",
        });
      }
      //teken
      const token = user.generateToken();
  
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === "development" ? true : false,
          httpOnly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
        })
        .send({
          success: true,
          message: "Login Successfully",
          token,
          user,
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: "false",
        message: "Error In Login Api",
        error,
      });
    }
  };
 //get user profile 
 export const getUserProfileController=async (req,res)=>{
    try{
        const user=await userModel.findById(req.user._id);
        user.password=undefined;
      res.status(200).send({
        success:true,
        message:"User Profile Fetched Successfully",
        user
      })
    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In PRofile API",
          error,
        });
    }
 };
 ///logout 
 export const logoutController=async (req,res)=>{
    try{
        res.status(200).cookie("token", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
          }).send({
            sucess:true,
            message:"log  out successfully "
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error In logout  API",
          error,
        });
    }
 }
// UPDATE USER PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile API",
      error,
    });
  }
};

//update password
export const udpatePasswordController =async (req,res)=>{
  try{
    const user=await userModel.findById(req.user._id);
    const{oldPassword,newPassword}=req.body;
     if(!oldPassword || !newPassword){
      return res.status(500).send({
            success: false,
            message: "provide the  all field",
            error,
            });
     }
     const isMatch=await  user.comparePassword(oldPassword);
     if(!isMatch){
         return res.status(500).send({
          success: false,
          message: "invalid password",
          error,
        });
     }
     user.password=newPassword;
     await user.save();
    return  res.status(200).send({
      success:true,
      message:"updated successfully"
     })
      
  }catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
}
 
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from client photo
    const file = getDataUri(req.file);
    // delete prev image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    // update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    console.log("hello",cdb.public_id)
    user.profilePic = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save func
    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile pic API",
      error,
    });
  }
};

// 051lKqXexw1WcexnHbdwovl1hWw

//forget password 
export const passwordResetController=async(req,res)=>{
   try{
       const{email,newPassword,answer}=req.body;
       if(!email||!newPassword||!answer){
        return res.status(500).send({
          success: false,
          message: "please provide All fields",
        });
       }
       const user=await userModel.findOne({email,answer});
       if(!user){
        return  res.status(404).send({
          success: false,
          message: "user not found"
        });
       }
       user.password=newPassword;
       await user.save();
       res.status(200).send({
        success:true,
        message:"your password has been reset please login!"
       })
   }catch(error){
    res.status(500).send({
      success: false,
      message: "Error In reset password API",
      error,
    });
   }
}