import React from "react";
import { If, Else, Then } from "react-if";
import { Form } from "antd";

import { INPUT, DROP_DOWN } from "../../../constants/formConstants";
import Input from "../Input";
import DropDown from "../DropDown";

function EditableCell({
  value,
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  edit,
  editRowHandler,
  data,
  specificData,
  specificDataHandler,
  save,
  isEditableRowAvailable,
  forFocus,
  ...restProps
}) {
  const ddkey = record && `${record.key}-${dataIndex}`;

  console.log(">>>>>> inputType", inputType);

  const isValidType = () => inputType === INPUT || inputType === DROP_DOWN;

  if (!isValidType()) {
    return null;
  }

  return (
    <td {...restProps}>
      {/* <If condition={isValidType()}>
        <Then> */}
      <If condition={dataIndex === "operation"}>
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
                  cb={(data) => {
                    edit({
                      key: record.key,
                      [dataIndex]: data[dataIndex],
                    });
                  }}
                  defaultValue={record && record[dataIndex]}
                  fullWidth
                  //onBlurHandler={() => save(record.key)}
                  //onFocusHandler={() => isEditableRowAvailable && edit(record)}
                />
              </Then>
              <Else>
                <DropDown
                  propName={dataIndex}
                  menuItems={[]}
                  items={[]}
                  cb={(data) => {
                    specificDataHandler({ [ddkey]: data[dataIndex] });
                    edit({
                      key: record.key,
                      [dataIndex]:
                        data[dataIndex] && data[dataIndex].length
                          ? data[dataIndex][0].value
                          : "",
                    });
                  }}
                  fullWidth
                  //  onBlurHandler={() => save(get(record, "key", ""))}
                  //onFocusHandler={() => isEditableRowAvailable && edit(record)}
                />
              </Else>
            </If>
          </Form.Item>
        </Else>
      </If>
      {/* </Then>
      </If> */}
    </td>
  );
}

export default EditableCell;
