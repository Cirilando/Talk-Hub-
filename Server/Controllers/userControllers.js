const validator = require("validator");
const bcrypt = require("bcrypt");
const userDB = require("../Models/userModels");
const jwt = require("jsonwebtoken");
// const verifyToken = require("../Middleware/auth");
const userCreateData = async (req, res) => {
  try {
    const {name,  email, password,profilePic } = req.body;
    // let file = req.file;
   
    const userExist = await userDB.findOne({ email });

    if (userExist) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }

    if (!name  || !email || !password) {
      return res
        .status(200)
        .json({ message: "All the fields are required...", success: false });
    }

    if (!validator.isEmail(email)) {  
      return res
        .status(200)
        .json({ message: "Email must be valid", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let datas = {
      ...req.body,
      profilePic: req.file ? req.file.filename : null,
      password: hashedPassword

    };
    // console.log("data ",datas)
    const newUser = new userDB(datas);
    
    await newUser.save();
    // console.log("ProfilePic:",profilePic)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create user",
      success: false,
      error: error.message,
    });
  }
};
const emailIdChecking = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await userDB.findOne({ email }).select("-password");
    
    if (!checkEmail) {
      return res.status(404).json({
        message: "User doesn't exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Email verified",
      success: true,
      data: checkEmail,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


const loginData = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userDB.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const passwordMatching = await bcrypt.compare(password, user.password);
    if (!passwordMatching) {
      return res.status(404).json({ message: "Incorrect password", success: false });
    }

    const token = jwt.sign({ id: user._id }, "nothing", { expiresIn: "1y" });
    
    res.cookie("token", token)
       .status(200)
       .json({ message: "Login successful", success: true, token: token });
       
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login", success: false, error: error.message });
  }
};


const userDetails = async (req, res) => {
  try {
    const token = req.userId;
    // console.log("user id to get", token);
    const user = await userDB.findById(token);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User details",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to Fetch",
      success: false,
      error: error.message,
    });
  }
};

const allUserDetails = async (req, res) => {
  try {
    const allData = await userDB.find();
    return res.status(200).json({
      message: "fetched the data",
      data: allData,
      success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to Fetch",
      success: false,
      error: error.message,
    });
  }
};
// const logoutUser =  async (req,res)=>{
//   try {
//     const cookieOption = {
//       http: true,
//       secure: true,
//     };
//     return res.cookie("token", '', cookieOption).status(200).json({
//       message:"session out",
//       success:true
//     })
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Failed to Logout",
//       success: false,
//       error: error.message,
//     });
//   }

// }
const updateDetails = async (req, res) => {
  try {
    const token = req.userId
    // const user = await userDB.findByIdAndUpdate(token)
    const { name,profilePic} = req.body;
    const updateUser = await userDB.findByIdAndUpdate(
      token,
      { name,profilePic },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "User details updated successfully",
      data: updateUser,
      success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to Update",
      success: false,
      error: error.message,
    });
  }
};

const searchUser = async (req,res)=>{
  try {
    
    const {search}  = req.body;
    const query = new RegExp(search,"i","g")
    //RegExp = regular expression
    //i = case-insensitive it will match both uppercase and lowercase
    //g = used to search globally 

    const userSearch = await userDB.find({
      "$or":[
        {name:query},
        {email:query}
      ]
    })
    res.status(200).json({
      message: "Successfully fetched the data",
      data: userSearch,
      success:true
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch",
      success: false,
      error: error.message,
    });
  }
}
module.exports = {
  userCreateData,
  emailIdChecking,
  loginData,
  userDetails,
  updateDetails,
  searchUser,
  allUserDetails
};
