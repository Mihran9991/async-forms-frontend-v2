/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState, useEffect } from "react";
import { If, Then, Else } from "react-if";
import { Table, Input, InputNumber, Popconfirm, Form, Button } from "antd";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  console.log();

  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
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

function transformColumns(columns, data) {
  return [...columns, data];
}
function EditActoins({ record, cancel, save, isEditing, editingKey, edit }) {
  const editable = isEditing(record);
  return editable ? (
    <span>
      <a
        href="javascript:;"
        onClick={() => save(record.key)}
        style={{
          marginRight: 8,
        }}
      >
        Save
      </a>
      <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
        <a>Cancel</a>
      </Popconfirm>
    </span>
  ) : (
    <a disabled={editingKey !== ""} onClick={() => edit(record)}>
      Edit
    </a>
  );
}

const EditableTable = ({
  createColumnHandler,
  editColumnHandler,
  deleteColumnByNameHandler,
  createRowHandler,
  columns,
  rows,
}) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(rows);
  const [transformedColumns, setTransformedColumns] = useState([
    ...columns,
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => (
        <EditActoins
          record={record}
          save={save}
          edit={edit}
          cancel={cancel}
          isEditing={isEditing}
          editingKey={editingKey}
        />
      ),
    },
  ]);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
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
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  useEffect(() => {
    setTransformedColumns([
      ...columns,
      transformedColumns[transformedColumns.length - 1],
    ]);
  }, [columns]);

  const mergedColumns = transformedColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    // TODO:: handle row types here
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  console.log("transformedColumns", transformedColumns);

  return (
    <Form form={form} component={false}>
      <Button
        onClick={createRowHandler}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
      <Button
        onClick={createColumnHandler}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a Column
      </Button>
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
      />
    </Form>
  );
};

export default EditableTable;
