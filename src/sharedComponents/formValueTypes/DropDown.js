/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext } from "react";
import { Select, Divider, Button, message, Spin } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { If, Then, Else } from "react-if";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import Input from "./Input";
import { getDropDownDataValues } from "../../utils/formUtil";
import { EMPTY_VALUE } from "../../constants/errorMessages";
import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";
import { isFormFieldLocked } from "../../services/request/formService";
import socketContext from "../WithSocket/socketContext";

const { Option } = Select;

const OptionItem = ({ value, idx, propName, editable, cb }) => {
  return (
    <If condition={editable}>
      <Then>
        <Input
          defaultValue={value}
          cb={(editedItem) => cb(editedItem, idx)}
          propName={propName}
        />
      </Then>
      <Else>{value}</Else>
    </If>
  );
};

function DropDown({
  style,
  items = [],
  cb,
  defaultValue,
  propName,
  editable,
  menuItems,
  disabled: disabledFromProps,
  isFormatted,
  onBlurHandler = () => {},
  onFocusHandler = () => {},
  forInstance,
  onlyValues,
  belongsTo,
  withLoading,
}) {
  const commonActionsStyle = {
    marginRight: 5,
    padding: 8,
    display: "flex",
    cursor: "pointer",
    lineHeight: 1,
  };
  const socketData = useContext(socketContext);
  const disabled = forInstance
    ? get(
        socketData,
        `${belongsTo.formId}.${belongsTo.instanceId}.${belongsTo.fieldId}`,
        false
      )
    : disabledFromProps;
  const [editabelMenuItems, setEditabelMenuItems] = useState(menuItems || []);
  const [formattedItems, setFormattedItems] = useState([]);
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [currentItem, setCurrentItem] = useState({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const editItem = (editedData) => {
    setCurrentItem(editedData);
  };

  const dataCallback = editable ? editItem : cb;

  const addItem = () => {
    if (isEmpty(currentItem)) {
      message.error(EMPTY_VALUE);
      return;
    }

    const [[key, value]] = Object.entries(currentItem);
    const newItem = { key, value };
    const updatedItems = [...editabelMenuItems, newItem];

    if (onlyValues) {
      cb({
        [propName]: getDropDownDataValues(updatedItems),
      });
    } else {
      if (isFormatted) {
        const updatedFormattedItems = [...formattedItems, value];
        setFormattedItems(updatedFormattedItems);
        cb({ [propName]: updatedFormattedItems });
      } else {
        cb({
          [propName]: updatedItems,
        });
      }
    }
    setEditabelMenuItems(updatedItems);
    setCurrentItem({});
  };

  const onChangeHandler = (value, { children }) => {
    const {
      props: { itemKey },
    } = Array.isArray(children) ? children[0] : children;

    if (!editable) {
      setCurrentValue(value);

      if (isFormatted) {
        dataCallback({
          [propName]: value,
        });
        return;
      }

      if (!propName) {
        dataCallback({
          [itemKey]: value,
        });
        return;
      }

      dataCallback({
        [propName]: {
          [itemKey]: value,
        },
      });
    }
  };

  const resetItemsList = () => {
    setEditabelMenuItems([]);
    cb({
      [propName]: [],
    });
  };

  const instanceFocusHandler = async () => {
    const {
      formId,
      instanceId,
      fieldId,
      title,
      ownerId,
      type,
      columnId,
      rowId,
    } = belongsTo;
    setIsSpinning(true);
    try {
      const {
        data: { isLocked },
      } = await isFormFieldLocked(belongsTo);
      setTimeout(() => {
        setIsSpinning(false);
        setIsOpen(true);
      }, 1000);

      if (!isLocked) {
        startFieldChange({
          formId,
          ownerId,
          instanceName: instanceId,
          fieldName: fieldId,
          formName: title,
          ...(forInstance && {
            type,
            columnId,
            rowId,
          }),
        });
      } else {
        //TODO :: notify about already locked field
      }
    } catch {
      setIsSpinning(false);
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
      columnId,
      rowId,
    } = belongsTo;
    setIsOpen(false);

    finishFieldChange({
      formId,
      ownerId,
      instanceName: instanceId,
      fieldName: fieldId,
      formName: title,
      value: currentValue,
      type,
      columnId,
      rowId,
    });
  };

  const mainOnFocusHandler = (data) => {
    forInstance ? instanceFocusHandler() : onFocusHandler(data);
  };

  const mainOnBlurHandler = (data) => {
    forInstance ? instanceOnBlurHandler() : onBlurHandler(data);
  };

  return (
    <Spin spinning={isSpinning}>
      <If condition={!editable && items.length > 0}>
        <Then>
          <Select
            disabled={disabled || isSpinning}
            onChange={onChangeHandler}
            onBlur={mainOnBlurHandler}
            onFocus={mainOnFocusHandler}
            defaultValue={currentValue ? currentValue : defaultValue}
            style={{ width: "100%", ...(style && style) }}
            placeholder={get(items, "[0].value", "Select an item")}
            {...(withLoading && { open: isOpen })}
          >
            {items.map(({ value: itemValue, key: itemKey }, idx) => {
              return (
                <Option value={itemValue} key={idx}>
                  <OptionItem
                    value={itemValue}
                    itemKey={itemKey}
                    idx={idx}
                    propName={propName}
                    editable={Boolean(editable)}
                    cb={cb}
                  />
                </Option>
              );
            })}
          </Select>
        </Then>
        <Else>
          <Select
            {...(withLoading && { open: isOpen })}
            disabled={disabled || isSpinning}
            onBlur={mainOnBlurHandler}
            onFocus={mainOnFocusHandler}
            allowClear={true}
            style={{ width: "100%", ...(style && style) }}
            placeholder={get(menuItems, "[0].value", "Add items")}
            dropdownRender={(menu) => (
              <div>
                {menu}
                <Divider style={{ margin: "4px 0" }} />
                <div
                  style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                >
                  <Input
                    style={{ flex: "auto" }}
                    cb={editItem}
                    propName={propName}
                    reset={isEmpty(currentItem)}
                    fullWidth
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: 2,
                    marginBottom: 5,
                    marginTop: 5,
                  }}
                >
                  <Button
                    type="primary"
                    style={commonActionsStyle}
                    onClick={addItem}
                  >
                    Add item
                    <PlusOutlined style={{ marginRight: 2 }} />
                  </Button>
                  <Button
                    type="danger"
                    style={commonActionsStyle}
                    onClick={resetItemsList}
                  >
                    Reset items
                    <DeleteOutlined style={{ marginRight: 2 }} />
                  </Button>
                </div>
              </div>
            )}
          >
            {editabelMenuItems.map(({ value }, idx) => (
              <Option key={idx}>{value}</Option>
            ))}
          </Select>
        </Else>
      </If>
    </Spin>
  );
}

export default DropDown;
