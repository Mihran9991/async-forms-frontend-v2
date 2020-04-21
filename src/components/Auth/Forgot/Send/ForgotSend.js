import { renderDOM as commonRenderDom, showMessage } from "../Forgot";
import React, { useState } from "react";
import ForgotService from "../../../../services/forgotService";

const ForgotSendForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    ForgotService.sendRequest(formData)
      .then((response) => {
        showMessage(response.data.message);
        // TODO: redirect to login page
      })
      .catch(() => {
        showMessage("Unable to send request");
      });
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h3>Forgot Password</h3>
        <br />
        <h5 id="info" style={{ display: "none" }} />
        <br />
        {renderDOM()}
        <button onClick={handleSubmit} className="btn btn-primary btn-block">
          Send email
        </button>
      </form>
    </div>
  );
};

const initialFormData = Object.freeze({
  email: "",
});

export default ForgotSendForm;
