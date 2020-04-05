import React, { useState } from "react";

function TextInput({ type, size, cb, propName }) {
  const [value, setValue] = useState("");

  const onChangeHandler = ({ target: { value } }) => {
    setValue(value);
    cb({
      [propName]: value,
    });
  };

  return (
    <input
      type={type}
      className="form-control"
      onChange={onChangeHandler}
      value={value}
      aria-label={size}
    />
  );
}

export default TextInput;
