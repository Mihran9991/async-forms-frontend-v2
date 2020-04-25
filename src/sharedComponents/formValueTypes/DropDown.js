/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Select, Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { If, Then, Else } from "react-if";
import isEmpty from "lodash/isEmpty";

import Input from "./Input";
import styles from "./types.module.scss";

const { Option } = Select;

function DropDown({
  items = [],
  cb,
  defaultValue,
  propName,
  editable,
  menuItems,
}) {
  const [editabelMenuItems, setEditabelMenuItems] = useState(menuItems || []);
  const [currentValue, setCurrentValue] = useState(
    defaultValue || "Select an Item"
  );

  const [currentItem, setCurrentItem] = useState({});

  const editItem = (editedData, idx) => {
    setCurrentItem(editedData);
    // const updatedItems = [...editabelMenuItems];
    // updatedItems[idx] = {
    //   ...updatedItems[idx],
    //   value: editedData[propName],
    // };
    // console.log("updatedItems", updatedItems);
    // dataCallback({
    //   [propName]: updatedItems,
    // });
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
    console.log("addItem", currentItem);
    const [[key, value]] = Object.entries(currentItem);
    const updatedItems = [...editabelMenuItems, { key, value }];

    setEditabelMenuItems(updatedItems);
    setCurrentItem({});
    cb({
      [propName]: updatedItems,
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
          style={{ width: "100%" }}
          placeholder="custom dropdown render"
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
