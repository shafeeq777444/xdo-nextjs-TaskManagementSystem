"use client"; // Ensures this runs on the client side

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import useAuthRedirect from "@/components/useAuthRedirect";
import { useEffect } from "react";

const Register = () => {

    useAuthRedirect(); // ✅ Now runs only once when the component mounts

  const router = useRouter(); 
  const { register, loading ,checkAuth} = useAuth(); 
    const pathname = usePathname(); 
       useEffect(()=>{
        checkAuth()
       },[pathname])
  return (
    <div className="flex justify-center items-center h-screen bg-teal-50">
      <div className="bg-white p-8 shadow-md rounded-lg w-96 md:hover:scale-110 transition-transform duration-500 ease-in-out max-md:h-full max-md:w-full flex flex-col justify-center ">
      <div className="">
      <h2 className="text-3xl font-bold mb-4">X <span>Do</span></h2>
            <div className="flex justify-center items-center"><img src="/register.png"  ></img></div>
           
      </div>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
          })}
          onSubmit={async(values) => {
            console.log("Form Values:", values);
            await register(values); 
            // router.push("/login");

          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4 ">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 text-xs px-2">Name</label>
                <Field type="text" name="name" className="w-full p-2 border rounded-2xl mt-1 placeholder:text-xs" placeholder="Enter your name" />
                <ErrorMessage name="name" component="p" className="text-red-500 text-xs pt-2 pr-2 text-right" />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-xs px-2 ">Email</label>
                <Field type="email" name="email" className="w-full p-2 border rounded-2xl mt-1 placeholder:text-xs " placeholder="Enter your email" />
                <ErrorMessage name="email" component="p" className="text-red-500 text-xs pt-2 pr-2 text-right" />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 text-xs px-2">Password</label>
                <Field type="password" name="password" className="w-full p-2 border rounded-2xl mt-1 placeholder:text-xs" placeholder="Enter your password" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-xs pt-2 pr-2 text-right" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition text-xs"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        {/* Login Button */}
        <button
          onClick={() => router.push("/login")}
          className="w-full mt-2 bg-gray-200 text-black py-2 rounded-xl hover:bg-gray-300 transition text-xs"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
