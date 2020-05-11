import React, { useEffect, useState, useContext } from "react";
import { Input as AInput, Spin } from "antd";
import get from "lodash/get";

import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";
import { isFormFieldLocked } from "../../services/request/formService";
import socketContext from "../WithSocket/socketContext";
import { TABLE } from "../../constants/formConstants";

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
  info: infoFromProps,
}) {
  const socketData = useContext(socketContext);
  const disabledBySocket =
    forInstance && belongsTo.type !== TABLE
      ? get(
          socketData,
          `${belongsTo.formId}.${belongsTo.instanceId}.${belongsTo.fieldId}`,
          false
        )
      : disabledFromProps;
  const disabled = !forInstance
    ? disabledBySocket
    : disabledBySocket || disabledFromProps;
  const [isSpinning, setIsSpinning] = useState(null);
  const [info, setInfo] = useState(infoFromProps);
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
    if (!isSpinning) {
      setDefaultValue("");
      setCurrentValue(value);

      if (callbackResponseOnlyValue) {
        cb(value);
      } else {
        cb({
          [propName]: value,
        });
      }
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

      if (!isLocked) {
        setTimeout(() => {
          setIsSpinning(false);
        }, 1000);

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
    } catch (err) {
      console.log("err", err);
    }
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
      if (info) {
        setInfo("");
      }

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
        {info && <span style={{ color: "red" }}>{info}</span>}
      </Spin>
    </div>
  );
}

export default Input;
