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

  useEffect(() => {
    setDefaultValue(defaultValueFromProps);
  }, [defaultValueFromProps]);

  return (
    <input
      style={{ width: fullWidth ? "100%" : "inherit" }}
      type={type}
      className="form-control"
      onChange={onChangeHandler}
      value={defaultValue || currentValue}
      aria-label={size}
    />
  );
}

export default TextInput;
