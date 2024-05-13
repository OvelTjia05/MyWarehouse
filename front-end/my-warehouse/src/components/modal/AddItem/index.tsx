import { useEffect, useRef, useState } from "react";
import Loading from "../../Loading";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { API } from "../../../config";
import UpdateToken from "../../../config/UpdateToken";

type Unit = {
  id: string;
  id_user: string;
  name: string;
};

const Additem: React.FC<{ isVisible: boolean; onClose: Function }> = ({
  isVisible,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [unitList, setUnitList] = useState<Unit[]>([]);
  const [image, setImage] = useState<File | "">("");
  const ref = useRef<HTMLInputElement | null>(null);
  const token = localStorage.getItem("access_token");
  const id = localStorage.getItem("id_user");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getUnit = async () => {
    try {
      const response = await axios.get(`${API}/unit/${id}`, { headers });
      console.log("resp getUnit", response);
      const { status, data } = response.data;

      if (status === "success") {
        setUnitList(data.units);
      }
    } catch (error: any) {
      console.log("error submit", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const handleSubmit = async (e: any, { resetForm }: any) => {
    try {
      setIsLoading(true);
      console.log("e", e);

      const formData = new FormData();
      formData.append("name", e.name);
      formData.append("qty", e.qty);
      formData.append("id_unit", e.id_unit);
      formData.append("location", e.location);
      formData.append("description", e.description);
      if (image) {
        formData.append("picture", image);
      }

      const response = await axios.post(`${API}/item/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("ccc", formData);
      console.log("resp additem", response);

      const { status } = response.data;

      if (status === "success") {
        console.log("yeay");
        resetForm();
        setImage("");
        if (ref.current) {
          ref.current.value = "";
        }
        onClose();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log("error submit", error);
      if (error.response?.data.message === "jwt expired") {
        UpdateToken();
      }
    }
  };

  const formSchema = yup.object({
    name: yup
      .string()
      .min(2, "Minimum 2 character")
      .required("Item name is required"),
    qty: yup.number().min(1, "Minimum 1").required("Number is required"),
    id_unit: yup
      .string()
      .notOneOf(["Pick one"], "Select unit type")
      .required("Select unit type"),
    location: yup
      .string()
      .min(3, "Minimum 3 character")
      .required("Location is required"),
    description: yup
      .string()
      .min(3, "Minimum 3 character")
      .required("description is required"),
  });

  useEffect(() => {
    getUnit();
    const handleCloseKey = (e: any) => {
      console.log("aaa");
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleCloseKey);
    return () => window.removeEventListener("keydown", handleCloseKey);
  }, []);

  useEffect(() => console.log("image", image), [image]);

  return (
    isVisible && (
      <div className="flex fixed inset-0 z-10 bg-opacity-30 bg-slate-700 backdrop-blur-sm justify-center items-center">
        <Loading status={isLoading} />
        <div className="flex flex-col gap-3 shadow rounded-lg min-w-[300px] max-h-[500px] p-3 bg-base-100 relative overflow-hidden">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-error"
            onClick={() => onClose()}
          >
            ✕
          </button>
          <h3 className="font-bold text-secondary">Add Item</h3>
          <Formik
            validateOnChange={true}
            validationSchema={formSchema}
            initialValues={{
              name: "",
              qty: 0,
              id_unit: "",
              location: "",
              description: "",
            }}
            onSubmit={(data, { resetForm }) => {
              handleSubmit(data, { resetForm });
            }}
          >
            {({ errors, touched }) => (
              <Form className="form-control gap-3">
                <div className="relative max-h-52 overflow-y-scroll no-scrollbar">
                  <label className="label mt-2">
                    <span className="label-text">Item Name</span>
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Type here"
                    className={`input input-bordered w-full max-w-xs ${
                      touched.name && errors.name && "input-error"
                    }`}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                  <label className="label mt-2">
                    <span className="label-text">Picture</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="picture"
                    // value={image.name}
                    onChange={(e) => setImage(e.target.files?.[0] || "")}
                    ref={ref}
                    className={`file-input file-input-bordered w-full max-w-xs`}
                  />
                  <label className="label mt-2">
                    <span className="label-text">Quantity</span>
                  </label>
                  <Field
                    type="number"
                    name="qty"
                    max="100"
                    className={`input input-bordered w-full max-w-xs ${
                      touched.qty && errors.qty && "input-error"
                    }`}
                  />
                  <ErrorMessage
                    name="qty"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                  <label className="label mt-2">
                    <span className="label-text">Unit Type</span>
                  </label>
                  <Field
                    as="select"
                    name="id_unit"
                    className={`select select-bordered w-full max-w-xs ${
                      touched.id_unit && errors.id_unit && "select-error"
                    }`}
                  >
                    <option hidden>Pick one</option>
                    {unitList?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="id_unit"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                  <label className="label mt-2">
                    <span className="label-text">Location</span>
                  </label>
                  <Field
                    type="text"
                    name="location"
                    placeholder="Type here"
                    className={`input input-bordered w-full max-w-xs ${
                      touched.location && errors.location && "input-error"
                    }`}
                  />
                  <ErrorMessage
                    name="location"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                  <label className="label mt-2">
                    <span className="label-text">Description</span>
                  </label>
                  <Field
                    type="text"
                    name="description"
                    placeholder="Type here"
                    className={`input input-bordered w-full max-w-xs ${
                      touched.description && errors.description && "input-error"
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="text-error text-xs absolute"
                  />
                </div>
                <div className="flex gap-3 mt-3 justify-end">
                  <button
                    type="button"
                    className="btn bg-error text-white"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn bg-primary text-white">
                    Add
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  );
};

export default Additem;
