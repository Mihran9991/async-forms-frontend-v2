import React, {useState} from "react";
import {REGISTER_ROUTE} from "../../../constants/backend.config";
import {renderDOM as commonRenderMap} from "../Auth";
import {axiosInstance} from "../../index";

const RegisterForm = () => {
  const DOM = [
    {
      className: "form-group",
      label: "Name",
      input: {
        name: "name",
        type: "text",
        className: "form-control",
        placeholder: "Enter name",
      },
    },
    {
      className: "form-group",
      label: "Surname",
      input: {
        name: "surname",
        type: "text",
        className: "form-control",
        placeholder: "Enter surname",
      },
    },
    {
      className: "form-group",
      label: "Email address",
      input: {
        name: "email",
        type: "email",
        className: "form-control",
        placeholder: "Enter email",
      },
    },
    {
      className: "form-group",
      label: "New Password",
      input: {
        name: "password1",
        type: "password",
        className: "form-control",
        placeholder: "Enter new password",
      },
    },
    {
      className: "form-group",
      label: "Confirm Password",
      input: {
        name: "password2",
        type: "password",
        className: "form-control",
        placeholder: "Confirm new password",
      },
    }
  ];

  function renderDOM() {
    return commonRenderMap(DOM, handleChange);
  }

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      console.log("Passwords don't match!");
      // todo: code for showing error message //
      return;
    }
    const response = await axiosInstance.post(
      `${REGISTER_ROUTE}`,
      {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        password: formData.password1,
      }
    );
    if (response.status === 200) {
      console.log(response.data.message);
      // todo: code for storing token in cookies //
      // todo: code for redirecting to login page //
    } else {
      // todo: code for showing error message //
    }
  };

  return (
    <div className="register">
      <form>
        <h3>Register</h3>
        {renderDOM()}
        <button onClick={handleSubmit} className="btn btn-primary btn-block">
          Register
        </button>
        <p className="forgot-password text-right">
          // somehow use param with ${} instead of hardcoded text
          Already registered? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

const initialFormData = Object.freeze({
  name: "",
  surname: "",
  email: "",
  password1: "",
  password2: ""
});

export default RegisterForm;
