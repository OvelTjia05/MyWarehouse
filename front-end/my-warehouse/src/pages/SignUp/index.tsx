import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  IdentificationIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "../../components/ThemeToggle";
import axios from "axios";
import { API } from "../../config";
import Loading from "../../components/Loading";

const SignUp = () => {
  const navigate = useNavigate();
  // const controller = new AbortController();
  // const signal = controller.signal;
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPassword2Visible, setIsPassword2Visible] = useState(false);

  const loginSchema = yup.object({
    username: yup
      .string()
      .min(2, "Minimum 2 character")
      .required("Username is required"),
    name: yup
      .string()
      .min(2, "Minimum 2 character")
      .required("Name is required"),
    password: yup
      .string()
      .min(5, "Minimum 5 character")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Password not match")
      .min(5, "Minimum 5 character")
      .required("Confirm password is required"),
  });

  const handleSignUp = async (e: any) => {
    try {
      setIsLoading(true);
      console.log(API);
      console.log("form signup", e);
      console.log("ini api: ", API);
      const response = await axios.post(
        `${API}/authentication/register`,
        {
          name: e.name,
          username: e.username,
          password: e.password,
        }
        // { signal }
      );
      console.log("resp signup", response);
      const { status } = response.data;

      if (status === "success") {
        navigate("/login");
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.error("error signup", error);
    }
  };

  // useEffect(() => {
  //   return () => controller.abort();
  // }, []);

  return (
    <div className="flex">
      <Loading status={isLoading} />
      <div className=" max-sm:w-1/2 max-sm:fixed max-sm:left-0 -z-10 w-1/4 min-h-screen rounded-r-[79px] bg-primary"></div>

      <div className="h-screen flex flex-1 justify-center items-center">
        <div className="absolute top-2 right-2">
          <ThemeToggle />
        </div>
        <div className=" max-sm:[&_span]:text-slate-100 w-3/5">
          <h1 className="text-gray">Get's Started</h1>
          <h5 className=" text-gray">
            Already have Account? <a href="/login">Log In</a>
          </h5>

          <Formik
            validateOnChange={true}
            validationSchema={loginSchema}
            initialValues={{
              username: "",
              name: "",
              password: "",
              confirmPassword: "",
            }}
            onSubmit={handleSignUp}
          >
            {({ errors, touched }) => (
              <Form className="form-control">
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <div className="mb-4">
                  <div
                    className={`input input-sm px-2 gap-x-1 ${
                      touched.username && errors.username && "input-error"
                    } input-bordered flex justify-between items-center`}
                  >
                    <UserIcon className="w-4" />
                    <Field
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="bg-transparent flex-1"
                      // value={formData.username}
                      // onChange={handleChange}
                    />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                </div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <div className="mb-4">
                  <div
                    className={`input input-sm px-2 gap-x-1 ${
                      touched.name && errors.name && "input-error"
                    } input-bordered flex justify-between items-center`}
                  >
                    <IdentificationIcon className="w-4" />
                    <Field
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="bg-transparent flex-1"
                      // value={formData.username}
                      // onChange={handleChange}
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                </div>
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <div className={`mb-4`}>
                  <div
                    className={`input input-sm px-2 gap-x-1 ${
                      touched.password && errors.password && "input-error"
                    } input-bordered flex justify-between items-center`}
                  >
                    <LockClosedIcon className="w-4" />
                    <Field
                      type={isPasswordVisible ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="bg-transparent flex-1"
                      // value={formData.password}
                      // onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="border-none pl-1 max-sm:text-primary"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        <EyeIcon className="w-4" />
                      ) : (
                        <EyeSlashIcon className="w-4" />
                      )}
                    </button>
                  </div>

                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                </div>
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className={`mb-10`}>
                  <div
                    className={`input input-sm px-2 gap-x-1 ${
                      touched.confirmPassword &&
                      errors.confirmPassword &&
                      "input-error"
                    } input-bordered flex justify-between items-center`}
                  >
                    <LockClosedIcon className="w-4" />
                    <Field
                      type={isPassword2Visible ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="bg-transparent flex-1"
                      // value={formData.password}
                      // onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="border-none pl-1 max-sm:text-primary"
                      onClick={() => setIsPassword2Visible(!isPassword2Visible)}
                    >
                      {isPassword2Visible ? (
                        <EyeIcon className="w-4" />
                      ) : (
                        <EyeSlashIcon className="w-4" />
                      )}
                    </button>
                  </div>

                  <ErrorMessage
                    name="confirmPassword"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-secondary text-white hover:bg-cyan-500"
                >
                  Sign Up
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
