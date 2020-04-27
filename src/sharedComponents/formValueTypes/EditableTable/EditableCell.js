import React from "react";
import { Form } from "antd";

import { INPUT } from "../../../constants/formConstants";
import Input from "../Input";
import DropDown from "../DropDown";

function EditableCell({
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
  const inputNode =
    inputType === INPUT ? (
      <Input
        propName={dataIndex}
        onBlurHandler={() => save(record.key)}
        onFocusHandler={() => isEditableRowAvailable && edit(record)}
        cb={(data) => {
          edit({
            key: record.key,
            [dataIndex]: data[dataIndex],
          });
        }}
        defaultValue={record && record[dataIndex]}
        fullWidth
      />
    ) : (
      <DropDown
        menuItems={specificData ? specificData[ddkey] : []}
        editable
        propName={dataIndex}
        onBlurHandler={() => save(record.key)}
        onFocusHandler={() => isEditableRowAvailable && edit(record)}
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
      />
    );

  return (
    <td {...restProps}>
      {editing ? (
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
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}

export default EditableCell;
