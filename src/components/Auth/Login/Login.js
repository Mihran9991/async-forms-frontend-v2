import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { renderDOM as commonRenderDom } from "../Auth";
import authService from "../../../services/request/authService";
import cookieService from "../../../services/cookie/cookieService";
import routeConstants from "../../../constants/routeConstants";

const LoginForm = ({ history }) => {
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
    // todd:: wrap in try/catch block
    const response = await authService.loginRequest(formData);
    console.log("Got response: " + response.data);
    if (response.status === 200) {
      const token = response.data.token;
      cookieService.addCookie("user", token);
      history.push(routeConstants.DASHBOARD);
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

export default withRouter(LoginForm);
