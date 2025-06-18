import User from "../models/User.js"

export async function getAllUsers(req,res) {
    try{
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        })
    }
    catch(error){
        console.log("Error in getAllUser controller",error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching users",
        })
    }
}