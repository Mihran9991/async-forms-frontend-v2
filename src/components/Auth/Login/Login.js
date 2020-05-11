import React, { useState } from "react";
import { Spin } from "antd";

import { renderDOM as commonRenderDom } from "../Auth";
import authService from "../../../services/request/authService";
import cookieService from "../../../services/cookie/cookieService";
import routeConstants from "../../../constants/routeConstants";
import { withRouter } from "react-router-dom";

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

function renderDOM({ handleChange }) {
  return commonRenderDom(DOM, handleChange);
}

const LoginForm = ({ history }) => {
  const [formData, updateFormData] = useState(
    Object.freeze({
      email: "",
      password: "",
    })
  );
  const [isSpinning, setIsSpinning] = useState(false);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    // TODO ::token is null before first refresh
    e.preventDefault();
    setIsSpinning(true);
    try {
      const response = await authService.loginRequest(formData);
      console.log("Got response: ", response.data, response.status);
      const token = response.data.token;
      cookieService.addCookie("user", token);
      history.push(`${routeConstants.DASHBOARD}${routeConstants.FORMS}`);
    } catch (e) {
      console.log("err", e);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <Spin spinning={isSpinning}>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <h3>Login</h3>
          {renderDOM({ handleChange })}
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
    </Spin>
  );
};

export default withRouter(LoginForm);
