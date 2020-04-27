/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Select, Divider, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { If, Then, Else } from "react-if";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import Input from "./Input";
import { formatDropDownData } from "../../utils/formUtil";

const { Option } = Select;

function DropDown({
  style,
  items = [],
  cb,
  defaultValue,
  propName,
  editable,
  menuItems,
  disabled,
  callbackResponseOnlyValue,
  onBlurHandler = () => {},
  onFocusHandler = () => {},
}) {
  const commonActionsStyle = {
    marginRight: 5,
    padding: 8,
    display: "flex",
    cursor: "pointer",
    lineHeight: 1,
  };

  const [editabelMenuItems, setEditabelMenuItems] = useState(menuItems || []);
  const [formattedItems, setFormattedItems] = useState([]);
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [currentItem, setCurrentItem] = useState({});

  const editItem = (editedData) => {
    setCurrentItem(editedData);
  };

  const dataCallback = editable ? editItem : cb;

  const addItem = () => {
    const [[key, value]] = Object.entries(currentItem);
    const newItem = { key, value };
    const updatedItems = [...editabelMenuItems, newItem];

    if (callbackResponseOnlyValue) {
      const updatedFormattedItems = [...formattedItems, value];
      setFormattedItems(updatedFormattedItems);
      cb({ [propName]: updatedFormattedItems });
    }

    setEditabelMenuItems(updatedItems);
    setCurrentItem({});
    cb({
      [propName]: formatDropDownData({ updatedItems }),
    });
  };

  const onClickHandler = (value, { children }) => {
    const {
      props: { itemKey },
    } = Array.isArray(children) ? children[0] : children;

    if (!editable) {
      setCurrentValue(value);

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

  const OptionItem = ({ value, idx }) => {
    return (
      <If condition={Boolean(editable)}>
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

  return (
    <If condition={!editable && items.length > 0}>
      <Then>
        <Select
          disabled={disabled}
          onChange={onClickHandler}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          defaultValue={currentValue}
          style={{ width: "100%", ...(style && style) }}
          placeholder={get(items, "[0].value", "Select an item")}
        >
          {items.map(({ value: itemValue, key: itemKey }, idx) => {
            return (
              <Option value={itemValue} key={idx}>
                <OptionItem value={itemValue} itemKey={itemKey} idx={idx} />
              </Option>
            );
          })}
        </Select>
      </Then>
      <Else>
        <Select
          disabled={disabled}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          allowClear={true}
          style={{ width: "100%", ...(style && style) }}
          placeholder={get(menuItems, "[0].value", "Add items")}
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: "4px 0" }} />
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
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
          {editabelMenuItems.map(({ value, key }, idx) => (
            <Option key={idx}>
              {value}
              {/* <Input
                defaultValue={value}
                propName={key}
                cb={(val) => {
                  const copy = [...editabelMenuItems];

                  for (let i = 0; i < copy.length; ++i) {
                    if (copy[i].key === key) {
                      copy[i].value = val;
                      setEditabelMenuItems(copy);
                      break;
                    }
                  }
                }}
                callbackResponseOnlyValue
                fullWidth
              /> */}
            </Option>
          ))}
        </Select>
      </Else>
    </If>
  );
}

export default DropDown;
