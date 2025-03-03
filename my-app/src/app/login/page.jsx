"use client";
import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import useAuthRedirect from "@/components/useAuthRedirect";

const LoginForm = () => {

    useAuthRedirect(); // ✅ Now runs only once when the component mounts

  const router = useRouter();
     const { loginUser } = useAuth(); 
  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Initial Values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle Submit
  const handleSubmit = async(values) => {
    console.log("Form Values:", values);
    await loginUser(values); 
    // router.push("/login");

  }
  const pathname = usePathname(); 
     const {checkAuth}=useAuth()
     useEffect(()=>{
      checkAuth()
     },[pathname])

  return (
    <div className="flex justify-center items-center h-screen bg-teal-50">
      
      <div className="bg-white p-8 shadow-md rounded-lg w-96 md:hover:scale-110 transition-transform duration-500 ease-in-out max-md:h-full max-md:w-full flex flex-col justify-center ">
      <h2 className="text-3xl font-bold mb-4">X <span>Do</span></h2>
      <div className="">
      
            <img src="/login.png" ></img>
           
      </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-xs px-2">Email</label>
              <Field
                type="email"
                name="email"
                className="w-full p-2 border rounded-2xl mt-1 placeholder:text-xs"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1 pt-2 pr-2 text-right" />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-gray-700 text-xs px-2">Password</label>
              <Field
                type="password"
                name="password"
                className="w-full p-2 border rounded-2xl mt-1 placeholder:text-xs"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1 pt-2 pr-2 text-right" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full  bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition  text-xs"
            >
              Login
            </button>
            
          </Form>
        </Formik>
        {/* Register Button */}
        <button onClick={() => router.push("/register")} className="w-full mt-2 bg-gray-200 text-black py-2 rounded-xl hover:bg-gray-300 transition text-xs">
          Register
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
