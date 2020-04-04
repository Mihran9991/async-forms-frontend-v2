import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function renderItemList(items) {
  return items.map(({ value }, idx) => {
    const onClickHandler = () => {
      console.log("DropDown Item Value", value);
    };

    return (
      <Dropdown.Item onClick={onClickHandler} key={idx}>
        {value}
      </Dropdown.Item>
    );
  });
}

function DropDown(props) {
  const { items } = props;

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Select an Item
      </Dropdown.Toggle>
      <Dropdown.Menu>{renderItemList(items)}</Dropdown.Menu>
    </Dropdown>
  );
}

export default DropDown;
