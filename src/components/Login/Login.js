import React from "react";
import axios from "axios";

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
      "localhost:3001/login",
      formData
    );
    console.log(response.data);
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

export default LoginForm;
