import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

function renderItemList(items, cb, setCurrentValue, propName) {
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
      <Dropdown.Item onClick={onClickHandler} key={idx}>
        {value}
      </Dropdown.Item>
    );
  });
}

function DropDown({ items, cb, defaultValue, fullWidth, propName }) {
  const [currentValue, setCurrentValue] = useState(
    defaultValue || "Select an Item"
  );

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="primary"
        id="dropdown-basic"
        style={{ width: fullWidth ? "100%" : "inherit" }}
      >
        {currentValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {renderItemList(items, cb, setCurrentValue, propName)}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
