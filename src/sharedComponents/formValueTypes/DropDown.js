/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useContext, useEffect } from "react";
import { Select, Divider, Button, message, Spin, Modal, Table } from "antd";
import { PlusOutlined, DeleteOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { If, Then, Else } from "react-if";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

import Input from "./Input";
import { getDropDownDataValues } from "../../utils/formUtil";
import { EMPTY_VALUE } from "../../constants/errorMessages";
import {
  startFieldChange,
  finishFieldChange,
} from "../../services/socket/emitEvents";
import {
  isFormFieldLocked,
  getFieldAudit,
} from "../../services/request/formService";
import socketContext from "../WithSocket/socketContext";
import { TABLE, AUDIT_TABLE_COLUMNS } from "../../constants/formConstants";

const { Option } = Select;

const OptionItem = ({ value, idx, propName, editable, cb }) => {
  return (
    <If condition={editable}>
      <Then>
        <Input
          defaultValue={value}
          cb={(editedItem) => cb(editedItem, idx)}
          propName={propName}
        />
      </Then>
      <Else>{value}</Else>
    </If>
  );
};

function DropDown({
  style,
  items = [],
  cb,
  defaultValue,
  propName,
  editable,
  menuItems,
  disabled: disabledFromProps,
  isFormatted,
  onBlurHandler = () => {},
  onFocusHandler = () => {},
  forInstance,
  onlyValues,
  belongsTo,
  withLoading,
  info: infoFromProps,
}) {
  const commonActionsStyle = {
    marginRight: 5,
    padding: 8,
    display: "flex",
    cursor: "pointer",
    lineHeight: 1,
  };
  const socketData = useContext(socketContext);
  const disabledBySocket =
    forInstance && belongsTo.type !== TABLE
      ? get(
          socketData,
          `${belongsTo.formId}.${belongsTo.instanceId}.${belongsTo.fieldId}`,
          false
        )
      : disabledFromProps;
  const disabled = !forInstance
    ? disabledBySocket
    : disabledBySocket || disabledFromProps;
  const [info, setInfo] = useState(infoFromProps);
  const [editabelMenuItems, setEditabelMenuItems] = useState(menuItems || []);
  const [formattedItems, setFormattedItems] = useState([]);
  const [currentValue, setCurrentValue] = useState(defaultValue);
  const [currentItem, setCurrentItem] = useState({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const editItem = (editedData) => {
    setCurrentItem(editedData);
  };

  const dataCallback = editable ? editItem : cb;

  const addItem = () => {
    if (isEmpty(currentItem)) {
      message.error(EMPTY_VALUE);
      return;
    }

    const [[key, value]] = Object.entries(currentItem);
    const newItem = { key, value };
    const updatedItems = [...editabelMenuItems, newItem];

    if (onlyValues) {
      cb({
        [propName]: getDropDownDataValues(updatedItems),
      });
    } else {
      if (isFormatted) {
        const updatedFormattedItems = [...formattedItems, value];
        setFormattedItems(updatedFormattedItems);
        cb({ [propName]: updatedFormattedItems });
      } else {
        cb({
          [propName]: updatedItems,
        });
      }
    }
    setEditabelMenuItems(updatedItems);
    setCurrentItem({});
  };

  const onChangeHandler = (value, { children }) => {
    const {
      props: { itemKey },
    } = Array.isArray(children) ? children[0] : children;

    if (!editable) {
      setCurrentValue(value);

      if (isFormatted) {
        dataCallback({
          [propName]: value,
        });
        return;
      }

      if (!propName) {
        dataCallback({
          [itemKey]: value,
        });
        return;
      }

      dataCallback({
        [propName]: {
          [itemKey]: value,
        },
      });
    }
  };

  const resetItemsList = () => {
    setEditabelMenuItems([]);
    cb({
      [propName]: [],
    });
  };

  const instanceFocusHandler = async () => {
    const {
      formId,
      instanceId,
      fieldId,
      title,
      ownerId,
      type,
      columnId,
      rowId,
    } = belongsTo;
    setIsSpinning(true);
    try {
      const {
        data: { isLocked },
      } = await isFormFieldLocked({
        formName: title,
        formId,
        instanceName: instanceId,
        fieldName: fieldId,
        ownerId,
        type: type || "",
        rowId: rowId || "",
        columnId: columnId || "",
      });
      setTimeout(() => {
        setIsSpinning(false);
        setIsOpen(true);
      }, 1000);

      if (!isLocked) {
        startFieldChange({
          formId,
          ownerId,
          instanceName: instanceId,
          fieldName: fieldId,
          formName: title,
          ...(forInstance && {
            type,
            columnId,
            rowId,
          }),
        });
      }
    } catch {
      setIsSpinning(false);
    }
  };

  const instanceOnBlurHandler = () => {
    const {
      formId,
      instanceId,
      fieldId,
      title,
      ownerId,
      type,
      columnId,
      rowId,
    } = belongsTo;
    setIsOpen(false);

    finishFieldChange({
      formId,
      ownerId,
      instanceName: instanceId,
      fieldName: fieldId,
      formName: title,
      value: currentValue,
      type,
      columnId,
      rowId,
    });
  };

  const mainOnFocusHandler = () => {
    if (forInstance) {
      instanceFocusHandler();
      return;
    }

    onFocusHandler();
  };

  const mainOnBlurHandler = (data) => {
    if (forInstance) {
      if (info) {
        setInfo("");
      }

      instanceOnBlurHandler();
      return;
    }

    onBlurHandler(data);
  };

  const openAuditModal = async () => {
    setIsSpinning(true);
    try {
      const audit = await getFieldAudit({
        params: {
          formName: belongsTo.title,
          instanceName: belongsTo.instanceId,
          fieldName: belongsTo.fieldId || "",
          rowId: belongsTo.rowId || "",
          columnName: belongsTo.columnId || "",
        },
      });
      const data = get(audit, "data", []);

      Modal.info({
        width: 800,
        title: `Audit of the ${belongsTo.fieldId} field`,
        content: <Table columns={AUDIT_TABLE_COLUMNS} dataSource={data} />,
        onOk() {},
      });
    } catch (e) {
      console.log("err", e);
    } finally {
      setIsSpinning(false);
    }
  };

  useEffect(() => {
    setCurrentValue(defaultValue);
  }, [defaultValue]);

  return (
    <Spin spinning={isSpinning}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <If condition={!editable && items.length > 0}>
          <Then>
            <Select
              disabled={disabled}
              onChange={onChangeHandler}
              onBlur={mainOnBlurHandler}
              onFocus={mainOnFocusHandler}
              value={currentValue}
              defaultValue={forInstance ? defaultValue : currentValue}
              style={{ width: "100%", ...(style && style) }}
              placeholder={get(items, "[0].value", "Select an item")}
              {...(withLoading && { open: isOpen })}
            >
              {items.map(({ value: itemValue, key: itemKey }, idx) => {
                return (
                  <Option value={itemValue} key={idx}>
                    <OptionItem
                      value={itemValue}
                      itemKey={itemKey}
                      idx={idx}
                      propName={propName}
                      editable={Boolean(editable)}
                      cb={cb}
                    />
                  </Option>
                );
              })}
            </Select>
          </Then>
          <Else>
            <Select
              {...(withLoading && { open: isOpen })}
              defaultValue={forInstance ? defaultValue : currentValue}
              disabled={disabled}
              onBlur={mainOnBlurHandler}
              onFocus={mainOnFocusHandler}
              allowClear={true}
              style={{ width: "100%", ...(style && style) }}
              placeholder={get(menuItems, "[0].value", "Add items")}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}
                  >
                    <Input
                      style={{ flex: "auto" }}
                      cb={editItem}
                      propName={propName}
                      reset={isEmpty(currentItem)}
                      fullWidth
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingRight: 2,
                      marginBottom: 5,
                      marginTop: 5,
                    }}
                  >
                    <Button
                      type="primary"
                      style={commonActionsStyle}
                      onClick={addItem}
                    >
                      Add item
                      <PlusOutlined style={{ marginRight: 2 }} />
                    </Button>
                    <Button
                      type="danger"
                      style={commonActionsStyle}
                      onClick={resetItemsList}
                    >
                      Reset items
                      <DeleteOutlined style={{ marginRight: 2 }} />
                    </Button>
                  </div>
                </div>
              )}
            >
              {editabelMenuItems.map(({ value }, idx) => (
                <Option key={idx}>{value}</Option>
              ))}
            </Select>
          </Else>
        </If>
        {forInstance && (
          <Button
            style={{ marginLeft: 5 }}
            type="primary"
            onClick={openAuditModal}
            >
              <ClockCircleOutlined />
            </Button>
        )}
      </div>
      {info && <span style={{ color: "red" }}>{info}</span>}
    </Spin>
  );
}

export default DropDown;
