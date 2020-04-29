import React, { useState } from "react";
import { If, Else, Then } from "react-if";
import { Form } from "antd";

import { INPUT, DROP_DOWN, OPERATION } from "../../../constants/formConstants";
import Input from "../Input";
import DropDown from "../DropDown";
import get from "lodash/get";

function EditableRow({
  value,
  dataIndex,
  inputType,
  record,
  children,
  editRowHandler,
}) {
  // const ddkey = record && `${record.key}-${dataIndex}`;
  const isValidType = () =>
    inputType === INPUT || inputType === DROP_DOWN || dataIndex === OPERATION;
  const [currentVal, setCurrentVal] = useState("");
  const key = get(record, "key", "");

  if (!isValidType()) {
    return null;
  }

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
            // TODO:: set dynamic required value
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
                  propName={dataIndex}
                  cb={setCurrentVal}
                  defaultValue={record && record[dataIndex]}
                  fullWidth
                  onBlurHandler={() => {
                    editRowHandler(key, currentVal);
                    setCurrentVal("");
                  }}
                />
              </Then>
              <Else>
                <DropDown
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
