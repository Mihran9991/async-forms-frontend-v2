import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

function renderItemList(items, cb, setCurrentValue) {
  return items.map(({ value, key }, idx) => {
    const onClickHandler = () => {
      setCurrentValue(value);
      cb({
        [key]: value,
      });
    };

    return (
      <Dropdown.Item onClick={onClickHandler} key={idx}>
        {value}
      </Dropdown.Item>
    );
  });
}

function DropDown({ items, cb, defaultValue }) {
  const [currentValue, setCurrentValue] = useState(
    defaultValue || "Select an Item"
  );

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        {currentValue}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {renderItemList(items, cb, setCurrentValue)}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
