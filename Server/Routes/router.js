const express = require("express");
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const {userCreateData,emailIdChecking, loginData, userDetails, updateDetails, searchUser, allUserDetails} = require("../Controllers/userControllers")
const verifyToken = require("../Middleware/auth")
const router  = express.Router()
const uploadDir = path.join("public","files")
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir,{recursive:true})
}

const Ciril = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueId = Date.now();
      const fileformat = file.originalname.split(".").pop();
      const fileName = file.originalname;
      cb(null, `${fileName} -${uniqueId}.${fileformat}`);
    },
  }); upload = multer({ storage: Ciril });
const singleUpload = upload.single("profilePic"); 
router.post("/register", singleUpload, userCreateData)
router.post("/email",emailIdChecking)
router.post("/login",loginData)
router.get("/user",verifyToken, userDetails)
router.put("/update",verifyToken,updateDetails)
router.post("/search",searchUser)
router.get("/all",allUserDetails)
router.use("/pic",express.static("public/files"))
module.exports= router;

  