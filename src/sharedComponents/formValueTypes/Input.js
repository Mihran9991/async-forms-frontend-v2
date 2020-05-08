import React, { useEffect, useState, useContext } from "react";
import { Input as AInput } from "antd";
import get from "lodash/get";

import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";
import socketContext from "../WithSocket/socketContext";

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
  disabled: disabledFromProps,
  resetCallback = () => {},
  onBlurHandler = () => {},
  onFocusHandler = () => {},
  belongsTo,
  forInstance,
}) {
  const socketData = useContext(socketContext);
  const disabled = forInstance
    ? get(
        socketData,
        `${belongsTo.formId}.${belongsTo.instanceId}.${belongsTo.fieldId}`,
        false
      )
    : disabledFromProps;
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

  const instanceFocusHandler = () => {
    const { formId, instanceId, fieldId, title } = belongsTo;

    console.log("cellOnFocusHandler");
    startFieldChange({
      formId,
      instanceName: instanceId,
      fieldName: fieldId,
      formName: title,
    });
  };

  const instanceOnBlurHandler = () => {
    const { formId, instanceId, fieldId, title } = belongsTo;

    console.log("cellOnBlurHandler");
    finishFieldChange({
      formId,
      instanceName: instanceId,
      fieldName: fieldId,
      formName: title,
      value: currentValue,
    });
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
        onBlur={forInstance ? instanceOnBlurHandler : onBlurHandler}
        onFocus={forInstance ? instanceFocusHandler : onFocusHandler}
        value={defaultValue || currentValue}
        aria-label={size}
        placeholder={placeholder}
        disabled={disabled}
      />
    </>
  );
}

export default Input;
