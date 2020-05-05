import { renderDOM as commonRenderDom, showMessage } from "../Forgot";
import React, { useState } from "react";
import ForgotService from "../../../../services/request/forgotService";
import QueryParamService from "../../../../services/request/queryParamService";

const ForgotResetForm = () => {
  const DOM = [
    {
      className: "form-group",
      label: "New Password",
      input: {
        name: "newPassword",
        type: "password",
        className: "form-control",
        placeholder: "Enter Password",
      },
    },
    {
      className: "form-group",
      label: "Confirm Password",
      input: {
        name: "confirmPassword",
        type: "password",
        className: "form-control",
        placeholder: "Confirm Password",
      },
    },
  ];

  function renderDOM() {
    return commonRenderDom(DOM, handleChange);
  }

  const [formData, updateFormData] = useState(
    Object.freeze({
      requestId: QueryParamService.getParam("requestId"),
      newPassword: "",
      confirmPassword: "",
    })
  );

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid(formData)) {
      showMessage("Passwords don't match");
      return;
    }
    ForgotService.resetRequest(formData)
      .then((response) => {
        showMessage(response.data.message);
      })
      .catch(() => {
        showMessage("Unable to reset password");
      });
  };

  return (
    <div className="forgot">
      <form onSubmit={handleSubmit}>
        <h3>Reset your password</h3>
        <br />
        <h5 id="info" style={{ display: "none" }} />
        <br />
        {renderDOM()}
        <button onClick={handleSubmit} className="btn btn-primary btn-block">
          Reset password
        </button>
      </form>
    </div>
  );
};

const isValid = (formData) => {
  return (
    formData.newPassword &&
    formData.confirmPassword &&
    formData.newPassword === formData.newPassword
  );
};

export default ForgotResetForm;
