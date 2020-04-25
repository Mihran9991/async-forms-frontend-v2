import React, { useState } from "react";
import { renderDOM as commonRenderMap } from "../Auth";
import authService from "../../../services/authService";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { renderDOM as commonRenderMap } from "../Auth";
import routeConstants from "../../../constants/routeConstants";
import authService from "../../../services/request/authService";

const RegisterForm = ({ history }) => {
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
    },
  ];

  function renderDOM() {
    return commonRenderMap(DOM, handleChange);
  }

  const [formData, updateFormData] = useState(
    Object.freeze({
      name: "",
      surname: "",
      email: "",
      password1: "",
      password2: "",
    })
  );

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password1 !== formData.password2) {
      console.log("Passwords don't match!");
      // todo: code for showing error message //
      return;
    }
    const response = await authService.registerRequest(formData);
    if (response.status === 200) {
      console.log(response.data.message);
      // todo: code for redirecting to login page //

      history.push(routeConstants.LOGIN);
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
          {/*somehow use param with ${} instead of hardcoded text*/}
          Already registered?{" "}
          <u>
            <a href="/login">Log in</a>
          </u>
        </p>
      </form>
    </div>
  );
};

export default withRouter(RegisterForm);
