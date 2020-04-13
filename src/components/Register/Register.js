import React from "react";

const DOM = [
  {
    className: "form-group",
    label: "First name",
    input: {
      type: "text",
      className: "form-control",
      placeholder: "First name",
    },
  },
  {
    className: "form-group",
    label: "Last name",
    input: {
      type: "text",
      className: "form-control",
      placeholder: "Last name",
    },
  },
  {
    className: "form-group",
    label: "Email address",
    input: {
      type: "email",
      className: "form-control",
      placeholder: "Enter email",
    },
  },
  {
    className: "form-group",
    label: "Password",
    input: {
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
        input: {type, className: inputClassName, placeholder},
      },
      idx
    ) => {
      return (
        <div className={className} key={idx}>
          <label>{label}</label>
          <input
            type={type}
            className={inputClassName}
            placeholder={placeholder}
          />
        </div>
      );
    }
  );
}

function Register() {
  return (
    <div className="register">
      <form>
        <h3>Register</h3>
        {renderDOM()}
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
        <p className="forgot-password text-right">
          Already registered? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
