import React, { useState } from "react";
import isFunction from "lodash/isFunction";

function TextInput({ type, size, cb, propName, onlyValue, defaultValue }) {
  const [value, setValue] = useState("");

  const onChangeHandler = ({ target: { value } }) => {
    setValue(value);

    if (isFunction(cb)) {
      if (onlyValue) {
        cb(value);
      } else {
        cb({
          [propName]: value,
        });
      }
    }
  };

  return (
    <input
      type={type}
      className="form-control"
      onChange={onChangeHandler}
      value={defaultValue || value}
      aria-label={size}
    />
  );
}

export default TextInput;
