import React from "react";
import { If, Else, Then } from "react-if";
import { Form, Popover } from "antd";
import get from "lodash/get";
import has from "lodash/has";

import {
  INPUT,
  DROP_DOWN,
  OPERATION,
  TABLE,
} from "../../constants/formConstants";
import Input from "../formValueTypes/Input";
import DropDown from "../formValueTypes/DropDown";

function EditableRow({
  value,
  dataIndex,
  inputType,
  record,
  children,
  editRowHandler,
  disabled,
  belongsTo,
  withLoading,
  info,
}) {
  const isValidType =
    inputType === INPUT || inputType === DROP_DOWN || dataIndex === OPERATION;
  const key = get(record, "rowId", "");

  if (!isValidType) {
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
                  cb={() => {}}
                  defaultValue={get(record, `${dataIndex}.value`, "")}
                  fullWidth
                  // onFocusHandler={cellOnFocusHandler}
                  // onBlurHandler={cellOnBlurHandler}
                  callbackResponseOnlyValue
                  withLoading={withLoading}
                  forInstance={withLoading}
                  belongsTo={{
                    ...belongsTo,
                    rowId: key,
                    columnId: dataIndex,
                    type: TABLE,
                  }}
                  info={info}
                />
              </Then>
              <Else>
                <DropDown
                  disabled={disabled}
                  isFormatted
                  fullWidth
                  propName={dataIndex}
                  defaultValue={
                    has(record, `${dataIndex}.value`)
                      ? get(record, `${dataIndex}.value`, "")
                      : get(value, "[0].value", "")
                  }
                  menuItems={[]}
                  items={value}
                  cb={() => {}}
                  // onFocusHandler={cellOnFocusHandler}
                  // onBlurHandler={cellOnBlurHandler}
                  onlyValues
                  withLoading={withLoading}
                  forInstance={withLoading}
                  belongsTo={{
                    ...belongsTo,
                    rowId: key,
                    columnId: dataIndex,
                    type: TABLE,
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
