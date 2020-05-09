import React, { useEffect, useState, useContext } from "react";
import { Input as AInput, Spin } from "antd";
import { If, Then, Else } from "react-if";
import get from "lodash/get";

import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";
import { isFormFieldLocked } from "../../services/request/formService";
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
  withLoading = false,
}) {
  const socketData = useContext(socketContext);
  const disabled = forInstance
    ? get(
        socketData,
        `${belongsTo.formId}.${belongsTo.instanceId}.${belongsTo.fieldId}`,
        false
      )
    : disabledFromProps;

  const [isSpinning, setIsSpinning] = useState(false);
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

  const instanceFocusHandler = async () => {
    const {
      formId,
      instanceId,
      fieldId,
      title,
      ownerId,
      type,
      rowId,
      columnId,
    } = belongsTo;
    setIsSpinning(true);
    try {
      const {
        data: { isLocked },
      } = await isFormFieldLocked(belongsTo);
      setTimeout(() => {
        setIsSpinning(false);
      }, 1000);

      if (!isLocked) {
        startFieldChange({
          formId,
          ownerId,
          instanceName: instanceId,
          fieldName: fieldId,
          formName: title,
          type,
          rowId,
          columnId,
        });
      } else {
        //TODO :: notify about already locked field
      }
    } catch {}
  };

  const instanceOnBlurHandler = () => {
    const {
      formId,
      instanceId,
      fieldId,
      title,
      ownerId,
      type,
      rowId,
      columnId,
    } = belongsTo;

    finishFieldChange({
      formId,
      ownerId,
      instanceName: instanceId,
      fieldName: fieldId,
      formName: title,
      value: currentValue,
      type,
      rowId,
      columnId,
    });
  };

  const mainOnFocusHandler = () => {
    if (forInstance) {
      instanceFocusHandler();
      return;
    }

    onFocusHandler();
  };

  const mainOnBlurHandler = (data) => {
    if (forInstance) {
      instanceOnBlurHandler();
      return;
    }

    onBlurHandler(data);
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
    <div style={{ width: getWidth(), ...(style && style) }}>
      <Spin spinning={withLoading && isSpinning}>
        <If condition={isSpinning}>
          <Then>
            <AInput
              style={{ position: "absolute", zIndex: 999 }}
              type={type}
              className="form-control"
              onChange={onChangeHandler}
              onBlur={mainOnBlurHandler}
              onFocus={mainOnFocusHandler}
              value={defaultValue || currentValue}
              aria-label={size}
              placeholder={placeholder}
              disabled={disabled || isSpinning}
            />
          </Then>
        </If>

        <AInput
          type={type}
          className="form-control"
          onChange={onChangeHandler}
          onBlur={mainOnBlurHandler}
          onFocus={mainOnFocusHandler}
          value={defaultValue || currentValue}
          aria-label={size}
          placeholder={placeholder}
          disabled={disabled}
        />
      </Spin>
    </div>
  );
}

export default Input;
