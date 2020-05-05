import React, { useState } from "react";
import { If, Else, Then } from "react-if";
import { Form } from "antd";
import get from "lodash/get";

import { INPUT, DROP_DOWN, OPERATION } from "../../constants/formConstants";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";
import { startFieldChange } from "../../services/socket/emitEvents";

function EditableRow({
  value,
  dataIndex,
  inputType,
  record,
  children,
  editRowHandler,
  disabled,
  owner,
}) {
  // const ddkey = record && `${record.key}-${dataIndex}`;
  const isValidType =
    inputType === INPUT || inputType === DROP_DOWN || dataIndex === OPERATION;
  const [currentVal, setCurrentVal] = useState("");
  const key = get(record, "key", "");

  if (!isValidType) {
    return null;
  }

  const cellOnFocusHandler = () => {
    console.log("cellOnFocusHandler");
    startFieldChange({
      rowId: record.key,
      columnId: dataIndex,
    });
  };

  return (
    <td>
      <If condition={dataIndex === OPERATION}>
        <Then>{children}</Then>
        <Else>
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: false,
                message: `Please Input ${dataIndex}!`,
              },
            ]}
          >
            <If condition={inputType === INPUT}>
              <Then>
                <Input
                  disabled={disabled}
                  propName={dataIndex}
                  cb={setCurrentVal}
                  defaultValue={record && record[dataIndex]}
                  fullWidth
                  onFocusHandler={cellOnFocusHandler}
                  onBlurHandler={() => {
                    editRowHandler(key, currentVal);
                    setCurrentVal("");
                  }}
                />
              </Then>
              <Else>
                <DropDown
                  disabled={disabled}
                  isFormatted
                  fullWidth
                  propName={dataIndex}
                  defaultValue={
                    record[dataIndex]
                      ? record[dataIndex]
                      : get(value, "[0].value", "")
                  }
                  menuItems={[]}
                  items={value}
                  cb={setCurrentVal}
                  onFocusHandler={cellOnFocusHandler}
                  onBlurHandler={() => {
                    editRowHandler(key, currentVal);
                    setCurrentVal("");
                  }}
                />
              </Else>
            </If>
          </Form.Item>
        </Else>
      </If>
    </td>
  );
}

export default EditableRow;

// specificDataHandler({ [ddkey]: data[dataIndex] });
// edit({
//   key: record.key,
//   [dataIndex]:
//     data[dataIndex] && data[dataIndex].length
//       ? data[dataIndex][0].value
//       : "",
// });
