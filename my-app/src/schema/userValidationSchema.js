import * as Yup from 'yup';

const userValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  password: Yup.string().required("Password is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default userValidationSchema;
