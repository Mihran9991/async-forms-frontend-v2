import React, { useEffect, useState } from "react";
import { Input as AInput } from "antd";

function Input({
  style,
  type,
  size,
  cb,
  propName,
  callbackResponseOnlyValue,
  defaultValue: defaultValueFromProps,
  reset,
  fullWidth,
  customWidth,
  placeholder,
  disabled,
  resetCallback = () => {},
  onBlurHandler = () => {},
  onFocusHandler = () => {},
}) {
  const [currentValue, setCurrentValue] = useState("");
  const [defaultValue, setDefaultValue] = useState(defaultValueFromProps);
  const getWidth = () => {
    if (customWidth) {
      return customWidth;
    }

    if (fullWidth) {
      return "100%";
    }

    return "inherit";
  };

  const onChangeHandler = ({ target: { value } }) => {
    setDefaultValue("");
    setCurrentValue(value);

    if (callbackResponseOnlyValue) {
      cb(value);
    } else {
      cb({
        [propName]: value,
      });
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
    <>
      <AInput
        style={{ width: getWidth(), ...(style && style) }}
        type={type}
        className="form-control"
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        value={defaultValue || currentValue}
        aria-label={size}
        placeholder={placeholder}
        disabled={disabled}
      />
    </>
  );
}

export default Input;
