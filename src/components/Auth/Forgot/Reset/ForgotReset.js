import { renderDOM as commonRenderDom } from "../../Auth";
import React, { useState } from "react";
import authService from "../../../../services/authService";
import cookieService from "../../../../services/cookieService";

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
  ];

  function renderDOM() {
    return commonRenderDom(DOM, handleChange);
  }

  const [formData, updateFormData] = useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await authService.loginRequest(formData);
    console.log("Got response: " + response.data);
    if (response.status === 200) {
      const token = response.data.token;
      cookieService.addCookie("user", token);
      console.log(token);
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
          <u>
            <a href="#">Forgot password?</a>
          </u>
        </p>
      </form>
    </div>
  );
};

const initialFormData = Object.freeze({
  email: "",
  password: "",
});

export default LoginForm;
