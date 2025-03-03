"use client"; // Ensures this runs on the client side

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter(); 
  const { updatePass } = useAuth(); 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        <Formik
          initialValues={{  password: "" }}
          validationSchema={Yup.object({
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
          })}
          onSubmit={async(values) => {
            console.log("Form Values:", values);
            await updatePass(values); 
            // router.push("/login");

          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              

              {/* Password Field */}
              <div>
                <label className="block text-gray-700">Password</label>
                <Field type="password" name="password" className="w-full p-2 border rounded mt-1" />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
