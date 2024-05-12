import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../../components/ThemeToggle";
import axios from "axios";
import { API } from "../../config";
import Loading from "../../components/Loading";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });

  const loginSchema = yup.object({
    username: yup
      .string()
      .min(2, "Minimum 2 character")
      .required("Username is required"),
    password: yup
      .string()
      .min(5, "Minimum 5 character")
      .required("Password is required"),
  });

  const handleLogin = async (e: any) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API}/authentication/login`, e);

      console.log("resp login", response);
      const { status, data } = response.data;

      if (status === "success") {
        localStorage.setItem("refresh_token", data.refreshToken);
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("id_user", data.id);
        localStorage.setItem("username", data.username);
        localStorage.setItem("name", data.name);
        navigate("/app/dashboard");
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  // const handleChange = (e: any) => {
  //   const { name, value } = e.target;

  //   setFormData({ ...formData, [name]: value });
  //   console.log(formData);
  // };

  return (
    <div className="flex">
      <Loading status={isLoading} />
      <div className="h-screen flex flex-1 justify-center items-center">
        <div className="absolute top-2 left-2">
          <ThemeToggle />
        </div>
        <div>
          <h1 className="text-gray">Get's Started</h1>
          <h5 className=" text-gray">
            Don't have account? <a href="/signup">Sign Up</a>
          </h5>
          <Formik
            validateOnChange={true}
            validationSchema={loginSchema}
            initialValues={{
              username: "",
              password: "",
            }}
            onSubmit={handleLogin}
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
                  <span className="label-text">Password</span>
                </label>
                <div className={`mb-10`}>
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
                      className="border-none pl-1 text-purple"
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
                <button
                  type="submit"
                  className="btn bg-secondary text-white hover:bg-cyan-500"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className=" max-sm:w-1/2 max-sm:fixed max-sm:right-0 -z-10 w-1/4 min-h-screen rounded-l-[79px] bg-primary"></div>
    </div>
  );
};

export default Login;
