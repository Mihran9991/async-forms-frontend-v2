import React, { useState, useEffect } from "react";
import isFunction from "lodash/isFunction";

function TextInput({
  type,
  size,
  cb,
  propName,
  onlyValue,
  defaultValue: defaultValueFromProps,
  reset,
  resetCallback = () => {},
  fullWidth,
}) {
  const [currentValue, setCurrentValue] = useState("");
  const [defaultValue, setDefaultValue] = useState(defaultValueFromProps);

  const value = defaultValue || currentValue;

  const onChangeHandler = ({ target: { value } }) => {
    setDefaultValue("");
    setCurrentValue(value);

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
      setCurrentValue("");
      resetCallback(false);
    }
  }, [reset]);

  return (
    <input
      style={{ width: fullWidth ? "100%" : "inherit" }}
      type={type}
      className="form-control"
      onChange={onChangeHandler}
      value={value}
      aria-label={size}
    />
  );
}

export default TextInput;
