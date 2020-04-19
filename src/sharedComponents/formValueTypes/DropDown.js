import React, { useState, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { If, Then, Else } from "react-if";
import filter from "lodash/filter";

import Input from "./Input";
import styles from "./types.module.scss";

function ItemList({
  items,
  cb,
  setCurrentValue,
  propName,
  removeItem,
  editable,
}) {
  return items.map(({ value, key }, idx) => {
    const onClickHandler = () => {
      if (!editable) {
        setCurrentValue(value);

        if (!propName) {
          cb({
            [key]: value,
          });
          return;
        }

        cb({
          [propName]: {
            [key]: value,
          },
        });
      }
    };

    return (
      <Dropdown.Item
        className={styles["item"]}
        onClick={onClickHandler}
        key={idx}
      >
        <If condition={Boolean(editable)}>
          <Then>
            <Input
              defaultValue={value}
              cb={(editedItem) => cb(editedItem, idx)}
              propName={propName}
            />
            <Button
              onClick={() => {
                removeItem(idx);
              }}
            >
              X
            </Button>
          </Then>
          <Else>{value}</Else>
        </If>
      </Dropdown.Item>
    );
  });
}

function DropDown({
  items: itemsFromProps,
  cb,
  defaultValue,
  fullWidth,
  propName,
  editable,
}) {
  const [showDropDown, setShowDropDown] = useState(false);
  const [currentValue, setCurrentValue] = useState(
    defaultValue || "Select an Item"
  );
  const [items, setItems] = useState(itemsFromProps);

  const removeItem = (deletableItemIdx) => {
    if (items.length === 1) {
      alert(`${propName} can't be empty`);
      return;
    }

    const updatedItems = filter(items, (_, id) => id !== deletableItemIdx);

    setItems(updatedItems);
    setCurrentValue(updatedItems[0].value);
    cb({
      [propName]: updatedItems,
    });
  };

  const addItem = () => {
    const updatedItems = [...items, { key: propName, value: "" }];

    setItems(updatedItems);
    cb({
      [propName]: updatedItems,
    });
    setShowDropDown(true);
  };

  const editItem = (editedData, idx) => {
    const updatedItems = [...items];
    updatedItems[idx] = {
      ...updatedItems[idx],
      value: editedData[propName],
    };

    setItems(updatedItems);
    cb({
      [propName]: updatedItems,
    });
  };

  const dropDownToggleHandler = (isOpen, event, { source }) => {
    if (editable && source === "select") {
      return;
    }

    setShowDropDown(isOpen);
  };

  useEffect(() => {
    setItems(itemsFromProps);
  }, [itemsFromProps]);

  return (
    <Dropdown show={showDropDown} onToggle={dropDownToggleHandler}>
      <Dropdown.Toggle
        variant="primary"
        id="dropdown-basic"
        style={{ width: fullWidth ? "100%" : "inherit" }}
      >
        {currentValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <ItemList
          items={items}
          cb={editable ? editItem : cb}
          removeItem={removeItem}
          setCurrentValue={setCurrentValue}
          propName={propName}
          editable={editable}
        />
        <If condition={Boolean(editable)}>
          <Dropdown.Item onClick={addItem}>
            <Button style={{ width: "100%" }}>+</Button>
          </Dropdown.Item>
        </If>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
