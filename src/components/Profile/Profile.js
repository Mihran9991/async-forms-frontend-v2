import React, { useState } from "react";
import { Button, Form, Upload } from "antd";
import Icon from "@ant-design/icons/lib/components/Icon";
import "antd/dist/antd.css";

import ProfileService from "../../services/request/profileService";
import { getCookie } from "../../services/cookie/cookieService";

const EditProfileForm = () => {
  const DOM = [
    {
      className: "form-group",
      label: "Name",
      input: {
        name: "name",
        type: "text",
        className: "form-control",
        placeholder: "Edit name",
      },
    },
    {
      className: "form-group",
      label: "Surname",
      input: {
        name: "surname",
        type: "text",
        className: "form-control",
        placeholder: "Edit surname",
      },
    },
  ];

  function renderDOM() {
    return DOM.map(
      (
        {
          className,
          label,
          input: { name, type, className: inputClassName, placeholder },
        },
        idx
      ) => {
        return (
          <div className={className} key={idx}>
            <label>{label}</label>
            <input
              name={name}
              onChange={handleChange}
              type={type}
              className={inputClassName}
              placeholder={placeholder}
            />
          </div>
        );
      }
    );
  }

  const [formData, updateFormData] = useState(
    Object.freeze({
      picture: null,
      name: "",
      surname: "",
    })
  );

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handlePictureChange = ({ file, onSuccess }) => {
    setTimeout(() => {
      updateFormData({
        ...formData,
        picture: file,
      });
      onSuccess();
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid(formData)) {
      showMessage("Fill in all fields");
      return;
    }
    const token = getCookie("user");
    return ProfileService.edit(formData, token)
      .then((response) => {
        showMessage(response.data.message);
      })
      .catch(() => {
        showMessage("Unable to edit profile");
      });
  };

  return (
    <div className="profile">
      <form onSubmit={handleSubmit}>
        <h3>Edit profile</h3>
        <br />
        <h5 id="info" style={{ display: "none" }} />
        <br />
        {renderDOM()}
        <div className="form-group">
          <label>Profile picture</label>
          <Form.Item>
            <Upload
              name="picture"
              accept=".jpg"
              method="POST"
              customRequest={handlePictureChange}
            >
              <Button>
                <Icon type="Upload" /> Upload
              </Button>
            </Upload>
          </Form.Item>
        </div>
        <button onClick={handleSubmit} className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
};

const isValid = (formData) => {
  return formData.name && formData.surname;
};

export const showMessage = (message) => {
  const elem = document.getElementById("info");
  elem.innerHTML = message;
  elem.style.display = "block";
};

export default EditProfileForm;
