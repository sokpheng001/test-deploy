"use client";

import { ErrorMessage, Field, Form, Formik, yupToFormErrors } from "formik";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useState } from "react";
import axios from "axios";
import Skeleton from "@/component/Skeleton.";

//loading

//set file size
const FILE_SIZE = 1024 * 1024 * 2; // 2MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "application/pdf",
];
//style on input
const inputStyle =
  "w-72 mb-3 text-black border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500";
const test =
  "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2";
//yup
const validateSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 character")
    .required("Password is required"),
  confirmedPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirmed Password is invalid")
    .required("Required for confirmed password"),
  avatar: Yup.string(),
  file: Yup.mixed()
    .test("fileSize", "File too large", (value) => {
      if (!value) {
        return true;
      }
      return value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Unsupported Format", (value) => {
      if (!value) {
        return true;
      }
      return SUPPORTED_FORMATS.includes(value.type);
    })
    .required("File is required"),
});
//using function
export default function Login() {
  const [isLoading, setLoading] = useState(false);

  // using api
  const isertUser = async (user) => {
    const { email, name, password, role, avatar } = user;
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
      email,
      name,
      password,
      avatar,
      role,
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      // redirect: "follow",
    };
    try {
      const get = await fetch(
        "https://api.escuelajs.co/api/v1/users",
        requestOptions
      );
      if (get.ok) {
        const data = await get.json();
        alert("User has been created successfully");
        return data;
      } else {
        alert("Somthing went wrong.");
      }
    } catch (error) {}
  };
  const imgPost = async (values) => {
    try {
      setLoading(true);
      const respone = await axios.post(
        "https://api.escuelajs.co/api/v1/files/upload",
        values.file
      );
      if (respone) {
        setLoading(false);
        return respone?.data?.location;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center">
      <div className="grid justify-items-center my-12">
        {isLoading ? (
          <div
            role="status"
            class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
          >
            <svg
              aria-hidden="true"
              class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        ) : null}
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmedPassword: "",
            role: "customer",
            avatar: "",
            file: undefined,
          }}
          validationSchema={validateSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const formData = new FormData();
            formData.append("file", values.file);
            const file1 = await imgPost({ file: formData });
            values.avatar = file1;
            const data = await isertUser(values);
            console.log(isLoading);
            setSubmitting(false);
            resetForm();
          }}
        >
          {({ isSubmitting, setFieldValue }) => {
            return (
              <Form className="">
                <p className="mb-3 font-black text-center text-2xl">Sign Up</p>
                {/* name */}
                <label htmlFor="name" className="mb-0">
                  Name
                </label>
                <Field
                  placeholder="Name"
                  type="text"
                  name="name"
                  className={inputStyle}
                />
                <ErrorMessage
                  name="name"
                  className="text-red-500  text-sm mb-2 -my-2"
                  component={"div"}
                />
                {/* email */}
                <label htmlFor="name" className="mb-0">
                  Email
                </label>
                <Field
                  placeholder="email"
                  type="email"
                  name="email"
                  className={inputStyle}
                />
                <ErrorMessage
                  name="email"
                  className="text-red-500  text-sm mb-2 -my-2"
                  component={"div"}
                />
                {/* password */}
                <label htmlFor="name" className="mb-0">
                  Password
                </label>
                <Field
                  placeholder="Password"
                  type="password"
                  name="password"
                  className={inputStyle}
                />
                <ErrorMessage
                  name="password"
                  className="text-red-500  text-sm mb-2 -my-2"
                  component={"div"}
                />
                {/* confirmed password */}
                <label htmlFor="name" className="mb-0">
                  Confirmed password
                </label>
                <Field
                  placeholder="confirmedPassword"
                  type="password"
                  name="confirmedPassword"
                  className={inputStyle}
                />
                <ErrorMessage
                  name="confirmedPassword"
                  component={"div"}
                  className="text-red-500  text-sm mb-2 -my-2"
                />
                {/* file uploading */}
                <Field
                  isSubmitting={isSubmitting}
                  name="file"
                  type="file"
                  title="Select a file"
                  setFieldValue={setFieldValue} // Set Formik value
                  component={CustomInput} // component prop used to render the custom input
                />
                <ErrorMessage name="file">
                  {(msg) => (
                    <div className="text-red-500  text-sm mb-2 my-1">{msg}</div>
                  )}
                </ErrorMessage>
                {/* Button */}
                <div className="space-x-4 flex justify-center float-left my-4">
                  <button
                    type="reset"
                    class="w-32 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Clear
                  </button>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    class="w-32 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Submit
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

const CustomInput = ({
  field,
  form,
  setFieldValue,
  isSubmitting,
  ...props
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [type, setType] = useState(null);
  useEffect(() => {
    if (isSubmitting) {
      setImagePreview(null);
    }
  }, [isSubmitting]);
  return (
    <div className="">
      <label id="file">Upload picture</label>
      <input
        id="file"
        type="file"
        onChange={(event) => {
          form.setFieldValue(field.name, event.currentTarget.files[0]);
          setImagePreview(URL.createObjectURL(event.currentTarget.files[0]));
          setType(event.currentTarget.files[0].type);
          console.log(type === "");
        }}
        {...props}
        className="block w-72 text-lg text-gray-900 border border-white-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-white-700 dark:border-white-600 dark:placeholder-gray-400"
      />
      {imagePreview && (
        <div>
          <img
            src={
              type !== ""
                ? imagePreview
                : "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
            }
            style={{ height: "100px" }}
            className=" rounded-lg my-2"
          />
        </div>
      )}
    </div>
  );
};
