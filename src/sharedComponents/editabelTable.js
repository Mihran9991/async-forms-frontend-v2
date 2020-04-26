/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState, useEffect } from "react";
import { If, Then, Else } from "react-if";
import { Table, Popconfirm, Form, Button } from "antd";

import Column from "../sharedComponents/Form/Column";
import DropDown from "./formValueTypes/DropDown";
import Input from "./formValueTypes/Input";
import {
  prepareRowDataForApi,
  prepareColumnDataForApi,
  isInvalidColumnAvailable,
} from "../utils/formUtil";
import { INPUT } from "../constants/formConstants";

const EditableCell = ({
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
}) => {
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
};

function GenerateTitle({
  editColumnHandler,
  deleteColumnByNameHandler,
  name,
  editable,
  type,
  uid,
}) {
  return (
    <Column
      name={name}
      editColumnHandler={(editedData) =>
        editColumnHandler(name, uid, editedData)
      }
      deleteColumnByNameHandler={deleteColumnByNameHandler}
      editable={editable}
      type={type}
    />
  );
}

const EditableTable = ({
  deleteColumnByNameHandler,
  editColumnHandler,
  createColumnHandler,
  deleteRowHandler,
  createRowHandler,
  editRowHandler,
  columns,
  rows,
  specificData,
  specificDataHandler,
}) => {
  const addTitle = (columns, editable) => {
    const withTitle = [...columns].reduce((acc, col) => {
      return [
        ...acc,
        {
          ...col,
          title: () => (
            <GenerateTitle
              editColumnHandler={editColumnHandler}
              deleteColumnByNameHandler={deleteColumnByNameHandler}
              columns={columns}
              name={col.dataIndex}
              editable={editable}
              type={col.type}
              uid={col.uid}
            />
          ),
        },
      ];
    }, []);

    return withTitle;
  };

  const [form] = Form.useForm();
  const [data, setData] = useState(rows);
  const [editingKey, setEditingKey] = useState("");

  const [forFocus, setForFocus] = useState({});

  const [transformedColumns, setTransformedColumns] = useState(
    addTitle(columns, !data.length)
  );

  const isEditing = (record) => editingKey === "" || record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...form.getFieldValue(),
      ...record,
    });

    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const resetErrors = (errors, key) => {
    for (let i = 0; i < errors.length; ++i) {
      if (errors[i].errors.length) {
        setForFocus({ key, fieldName: errors[i].name[0] });
        return;
      }
    }
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields(); // form.getFieldsValue();
      setForFocus({});
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }

      editRowHandler(newData);
    } catch (errInfo) {
      const errors = form.getFieldsError();

      resetErrors(errors, key);
    }
  };

  useEffect(() => {
    setTransformedColumns(addTitle(columns, !data.length));
  }, [columns]);

  useEffect(() => {
    setData(rows);
    setTransformedColumns(addTitle(columns, !rows.length));
  }, [rows]);

  const mergedColumns = [
    ...transformedColumns,
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        // edit(record);
        return (
          <If condition={editable}>
            <Then>
              <span>
                <Button
                  onClick={() => save(record.key)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  Save
                </Button>
                <Button
                  disabled={editingKey !== ""}
                  onClick={() => deleteRowHandler(record.key)}
                >
                  Delete
                </Button>
                {/* <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm> */}
              </span>
            </Then>
            <Else>
              <a disabled={editingKey !== ""} onClick={() => edit(record)}>
                Edit
              </a>
              {/* <a
                disabled={editingKey !== ""}
                onClick={() => deleteRowHandler(record.key)}
              >
                Delete
              </a> */}
            </Else>
          </If>
        );
      },
    },
  ].map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        edit,
        editRowHandler,
        data,
        specificData,
        specificDataHandler,
        isEditableRowAvailable: editingKey === "",
        save,
        forFocus,
      }),
    };
  });

  console.log("rows", data);

  return (
    <Form form={form} component={false}>
      <Button
        onClick={createColumnHandler}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a Column
      </Button>
      {/* <If condition={columns.length > 0 && !isInvalidColumnAvailable(columns)}>
        <Then>
          <Button
            onClick={createRowHandler}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button>
        </Then>
      </If> */}

      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        scroll={{ x: 700 }}
      />
    </Form>
  );
};

export default EditableTable;
