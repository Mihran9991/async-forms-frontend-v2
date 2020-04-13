import React, {useState} from "react";
import {LOGIN_ROUTE} from "../../../constants/backend.config";
import {renderDOM as commonRenderDom} from "../Auth";
import {axiosInstance} from "../../index";

const LoginForm = () => {
  const DOM = [
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
      label: "Password",
      input: {
        name: "password",
        type: "password",
        className: "form-control",
        placeholder: "Enter password",
      },
    }
  ];

  function renderDOM() {
    return commonRenderDom(DOM, handleChange);
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
    const response = await axiosInstance.post(
      `${LOGIN_ROUTE}`,
      {
        email: formData.email,
        password: formData.password
      }
    );
    if (response.status === 200) {
      const token = response.data.token;
      console.log(token);
      // todo: code for storing token in cookies //
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>
        {renderDOM()}
        <button onClick={handleSubmit} className="btn btn-primary btn-block">
          Log In
        </button>
        <p className="forgot-password text-right">
          <a href="#">Forgot password?</a>
        </p>
      </form>
    </div>
  );
};

const initialFormData = Object.freeze({
  email: "",
  password: ""
});

export default LoginForm;
