import React, { useState, useEffect } from "react";
import isFunction from "lodash/isFunction";

function TextInput({
  type,
  size,
  cb,
  propName,
  onlyValue,
  defaultValue,
  reset,
  resetCallback = () => {},
}) {
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

  useEffect(() => {
    if (reset) {
      setValue("");
      resetCallback(false);
    }
  }, [reset]);

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
