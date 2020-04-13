import React from "react";
import axios from "axios";
import {HOST, PORT, REGISTER_ROUTE} from "../../constants/backend.config";

const RegisterForm = () => {
  const DOM = [
    {
      className: "form-group",
      label: "Name",
      input: {
        name: "name",
        type: "text",
        className: "form-control",
        placeholder: "Name",
      },
    },
    {
      className: "form-group",
      label: "Surname",
      input: {
        name: "surname",
        type: "text",
        className: "form-control",
        placeholder: "Surname",
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
    return DOM.map(
      (
        {
          className,
          label,
          input: {name, type, className: inputClassName, placeholder},
        },
        idx
      ) => {
        return (
          <div className={className} key={idx}>
            <label>{label}</label>
            <input name={name} onChange={handleChange}
                   type={type}
                   className={inputClassName}
                   placeholder={placeholder}
            />
          </div>
        );
      }
    );
  }

  const initialFormData = Object.freeze({
    name: "",
    surname: "",
    email: "",
    password: ""
  });

  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post(
      `http://${HOST}:${PORT}${REGISTER_ROUTE}`,
      formData
    );
    if (response.status === 200) {
      console.log(response.data.message);
      // code for storing token in cookies //
      // code for redirecting to login page //
    } else {
      // code for showing error message //
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

export default RegisterForm;
