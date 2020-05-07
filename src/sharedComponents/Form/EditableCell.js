import React, { useState, useEffect } from "react";
import { If, Else, Then } from "react-if";
import { Form, Popover, Button } from "antd";
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
import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";

function EditableRow({
  value,
  dataIndex,
  inputType,
  record,
  children,
  editRowHandler,
  disabled,
  formId,
  instanceId,
  fieldId,
}) {
  console.log(record);

  const isValidType =
    inputType === INPUT || inputType === DROP_DOWN || dataIndex === OPERATION;
  const [currentVal, setCurrentVal] = useState("");
  const [isPopoverVisible, setIsPopoverVisible] = useState(disabled);
  const key = get(record, "rowId", "");

  const cellOnFocusHandler = () => {
    startFieldChange({
      rowId: key,
      columnId: dataIndex,
      formId,
      instanceId,
      fieldId,
      type: TABLE,
    });
  };

  const cellOnBlurHandler = () => {
    finishFieldChange({
      rowId: key,
      columnId: dataIndex,
      formId,
      instanceId,
      fieldId,
      type: TABLE,
    });

    editRowHandler(key, currentVal);
    setCurrentVal("");
  };

  useEffect(() => {
    setIsPopoverVisible(disabled);
    if (disabled) {
      setTimeout(() => {
        setIsPopoverVisible(false);
      }, 1500);
    }
  }, [disabled]);

  if (!isValidType) {
    return null;
  }

  return (
    <td>
      <Popover
        visible={isPopoverVisible}
        content={
          <>
            This field is being edited by John Doe
            <br />
            <Button onClick={() => setIsPopoverVisible(false)}>Close</Button>
          </>
        }
      >
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
                    defaultValue={get(record, `${dataIndex}.value`, "")}
                    fullWidth
                    onFocusHandler={cellOnFocusHandler}
                    onBlurHandler={cellOnBlurHandler}
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
                    cb={setCurrentVal}
                    onFocusHandler={cellOnFocusHandler}
                    onBlurHandler={cellOnBlurHandler}
                  />
                </Else>
              </If>
            </Form.Item>
          </Else>
        </If>
      </Popover>
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
