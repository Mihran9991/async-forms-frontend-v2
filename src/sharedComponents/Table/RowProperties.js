import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { AiOutlinePlus } from "react-icons/ai";
import { If, Then, Else } from "react-if";
import classnames from "classnames";
import get from "lodash/get";

import { transformRowData } from "../../utils/dataTransform";
import { DROP_DOWN, INPUT } from "../../constants/tableConstants";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import styles from "./table.module.scss";

function AddRowProperties({ data, cb, reset, resetCallback, currentValue }) {
  const [dropDownCurrentItems, setDropDownCurrentItems] = useState({});
  const [transformedRowDropDownData, setTransformedRowDropDownData] = useState(
    transformRowData(data)
  );

  const addDropDownItem = (name) => {
    const rowDropDownDataByName = get(
      transformedRowDropDownData,
      `${name}`,
      {}
    );

    const newItems = [
      ...get(rowDropDownDataByName, "items", []),
      get(dropDownCurrentItems, `${name}`, {}),
    ];

    setTransformedRowDropDownData({
      ...transformedRowDropDownData,
      [name]: {
        ...get(transformedRowDropDownData, `${name}`, {}),
        items: newItems,
        newItem: false,
      },
    });

    cb({
      [name]: {
        type: DROP_DOWN,
        value: newItems,
      },
    });
  };

  const dropDownCurrentItemHandler = (dropDownItem, name) => {
    const [[currentItemKey, currentItemValue]] = Object.entries(dropDownItem);

    setDropDownCurrentItems({
      ...dropDownCurrentItems,
      [name]: { key: currentItemKey, value: currentItemValue },
    });
  };

  const inputCurrentValueHandler = (inputItem, name) => {
    cb({
      [name]: {
        type: INPUT,
        value: inputItem,
      },
    });
  };

  useEffect(() => {
    if (reset) {
      setTransformedRowDropDownData([]);
    }
  }, [reset]);

  // TODO:: separate by mini components, add more effective way for rendering for different column types(for example - switch case)
  return (
    <div className={styles["add-row-properties"]}>
      {data.map(([name, { type }], idx) => {
        return (
          <div key={`ig_item_${idx}`}>
            <span>{name}</span>
            <If condition={type === DROP_DOWN}>
              <Then>
                <br />
                <Button
                  variant="outline-success"
                  onClick={() => {
                    setTransformedRowDropDownData({
                      ...transformedRowDropDownData,
                      [name]: {
                        ...transformedRowDropDownData[name],
                        newItem: true,
                      },
                    });
                  }}
                >
                  <AiOutlinePlus />
                  Add values to {name}
                </Button>
                <If
                  condition={get(
                    transformedRowDropDownData,
                    `${name}.newItem`,
                    false
                  )}
                >
                  <Then>
                    <Input
                      type="text"
                      propName={name}
                      cb={(dropDownItem) =>
                        dropDownCurrentItemHandler(dropDownItem, name)
                      }
                    />
                    <Button
                      variant="outline-success"
                      onClick={() => addDropDownItem(name)}
                    >
                      Add
                    </Button>
                  </Then>
                </If>
                <DropDown
                  cb={cb}
                  items={get(transformedRowDropDownData, `${name}.items`, [])}
                  defaultValue={name}
                />
              </Then>
              <Else>
                <Input
                  type="text"
                  propName={name}
                  cb={(currentValue) =>
                    inputCurrentValueHandler(currentValue, name)
                  }
                  {...{ [reset && "reset"]: true, resetCallback }}
                  defaultValue={get(currentValue, `${name}.value`, "")}
                  onlyValue
                />
              </Else>
            </If>
          </div>
        );
      })}
    </div>
  );
}

export default AddRowProperties;
