import React from 'react'
import logo from "../assets/logo.png"

const AuthLayout = ({children}) => {
  return (
    <>
   <div className=" ml-[18px] md:ml-[680px] flex md:mt-1 mt-2  ">
          <img
            className="md:w-[90px] w-[50px] md:ml-0 ml-[100px]   "
            src={logo}
            alt="Logo"
          />
          <p className=" mt-2 md:mt-5 font-bold font-serif md:text-xl ">
            Talk Hub
          </p>
        </div>
      {children}
    </>
  )
}

export default AuthLayout;