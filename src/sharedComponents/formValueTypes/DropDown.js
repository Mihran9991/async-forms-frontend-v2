/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Select, Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { If, Then, Else } from "react-if";
import filter from "lodash/filter";

import Input from "./Input";
import styles from "./types.module.scss";

const { Option } = Select;

function DropDown({ items, cb, defaultValue, propName, editable }) {
  const [currentValue, setCurrentValue] = useState(
    defaultValue || "Select an Item"
  );
  // const [items, setItems] = useState(itemsFromProps);
  const [editabelMenuItems, setEditabelMenuItems] = useState([]);

  const editItem = (editedData, idx) => {
    const updatedItems = [...editabelMenuItems];
    updatedItems[idx] = {
      ...updatedItems[idx],
      value: editedData[propName],
    };

    editabelMenuItems(updatedItems);
    dataCallback({
      [propName]: updatedItems,
    });
  };

  const dataCallback = editable ? editItem : cb;

  // const removeItem = (deletableItemIdx) => {
  //   if (items.length === 1) {
  //     alert(`${propName} can't be empty`);
  //     return;
  //   }
  //   const updatedItems = filter(items, (_, id) => id !== deletableItemIdx);

  //   setEditabelMenuItems(updatedItems);
  //   setCurrentValue(updatedItems[0].value);
  //   cb({
  //     [propName]: updatedItems,
  //   });
  // };

  const addItem = () => {
    const updatedItems = [...editabelMenuItems, { key: propName, value: "" }];

    setEditabelMenuItems(updatedItems);
    // cb({
    //   [propName]: updatedItems,
    // });
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

  const onNameChange = (event) => {
    setCurrentValue(event.target.value);
  };

  console.log("items", items);

  return (
    <If condition={!editable && items.length > 0}>
      <Then>
        <Select
          onChange={onClickHandler}
          defaultValue={currentValue}
          style={{ width: "100%" }}
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
          style={{ width: 240 }}
          placeholder="custom dropdown render"
          dropdownRender={(menu) => (
            <div>
              {menu}
              <Divider style={{ margin: "4px 0" }} />
              <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
                <Input
                  style={{ flex: "auto" }}
                  value={currentValue}
                  onChange={onNameChange}
                />
                <a
                  style={{
                    flex: "none",
                    padding: "8px",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={addItem}
                >
                  <PlusOutlined /> Add item
                </a>
              </div>
            </div>
          )}
        >
          {editabelMenuItems.map(({ value: itemValue, key: itemKey }, idx) => (
            <Option key={idx}>{itemValue}</Option>
          ))}
        </Select>
      </Else>
    </If>
  );
}

export default DropDown;
