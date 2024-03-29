import { asyncHandler } from "../asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser=asyncHandler(async (req,res)=>{
    const {fullName,email,username,password}=req.body;

    if(
        [fullName,email,username,password].some((field)=>field?.trim()==="" || !field)
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser=await User.findOne({
        $or:[{ username },{ email }]
    })
    if(existedUser){
        throw new ApiError(409,"User Already Exists");
    }

    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath);

    let coverImage=""
    if(coverImageLocalPath){
        coverImage=await uploadOnCloudinary(coverImageLocalPath);
    }

    const user=await User.create(
        {
            fullName:fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url||"",
            email,
            password,
            username:username.toLowerCase()
        }
    )
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"User could not be created successfully.")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser,"User created successfully")
    )
})

export {registerUser};