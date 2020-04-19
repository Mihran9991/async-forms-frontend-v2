import React, { useState } from "react";
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
    };

    return (
      <Dropdown.Item
        className={styles["item"]}
        onClick={onClickHandler}
        key={idx}
      >
        <If condition={Boolean(editable)}>
          <Then>
            <Input defaultValue={value} />
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

    console.log("items", items, deletableItemIdx);

    const updatedItems = filter(items, (_, id) => {
      console.log(id, "========", deletableItemIdx);
      return id !== deletableItemIdx;
    });

    console.log("updatedItems ----------->", updatedItems);

    setItems(updatedItems);
    // setCurrentValue(updatedItems[updatedItems.length - 1].value);
    // cb({
    //   [propName]: updatedItems,
    // });
  };

  const addItem = () => {
    setItems([...items, { name: propName, value: "" }]);
  };

  const dropDownToggleHandler = (isOpen, event, { source }) => {
    if (editable && source === "select") {
      return;
    }

    setShowDropDown(isOpen);
  };

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
          cb={cb}
          removeItem={removeItem}
          setCurrentValue={setCurrentValue}
          propName={propName}
          editable={editable}
        />

        <If condition={Boolean(editable)}>
          <Button style={{ width: "100%" }} onClick={addItem}>
            +
          </Button>
        </If>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
