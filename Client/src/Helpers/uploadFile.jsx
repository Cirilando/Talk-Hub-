// const uploadFiles = async (regData ,file) => {
// import uploadFiles from './uploadFile';
//   const formData = new FormData();
//   formData.append("userid", regData.userid);
//   formData.append("password", regData.password);
//   formData.append("email", regData.email);
//   formData.append("profilePic", file);
//   const response = await fetch("/register", {
//     method: "POST",
//     body: formData,
//   });
//   // if (!response.ok) {
//   //   throw new Error('Network response was not ok');
//   // }
//   const responseData = await response.json();
//   return responseData;
// };
// export default uploadFiles;

const url =`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`
const uploadFiles = async(file)=>{
  const formData = new FormData()
  formData.append("file",file)
  formData.append("upload_preset","chat-app-file")
  const response = await fetch(url,{
    method: "POST",
    body: formData
  })
  const responseData = await response.json()
  return responseData;
}
export default uploadFiles