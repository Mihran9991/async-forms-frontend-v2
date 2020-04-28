/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState } from "react";
import { If, Then, Else } from "react-if";
import { Table, Form, Button } from "antd";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";

import Title from "./Title";
import EditableCell from "./EditableCell";
import {
  getColumnsTypeObj,
  isInvalidColumnAvailable,
  isDuplicateColumnAvailable,
} from "../../../utils/formUtil";
import {
  transformObjectDataIntoArray,
  filterObjectByKey,
} from "../../../utils/dataTransformUtil";

const EditableTable = ({ cb, propName, saveStructureHandler, structure }) => {
  // TODO::
  const withTitle = (columns, editable, saveStructureHandler) => {
    const title = [...columns].reduce((acc, col) => {
      return [
        ...acc,
        {
          ...col,
          title: () => (
            <Title
              editColumnHandler={(...args) => {
                editColumnHandler(columns, ...args);
              }}
              deleteColumnByNameHandler={deleteColumnByNameHandler}
              saveStructureHandler={saveStructureHandler}
              cb={cb}
              propName={propName}
              columns={columns}
              name={col.dataIndex}
              editable={editable}
              type={col.type}
              uid={col.uid}
              data={get(col, "type.fields", [])}
              structure={structure}
            />
          ),
        },
      ];
    }, []);

    return title;
  };

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [forFocus, setForFocus] = useState({});
  const [specificData, setSpecificData] = useState({});

  const deleteColumnByNameHandler = (id) => {
    const columnsCopy = [...columns].filter((col) => {
      return col.dataIndex !== id;
    });

    const transformedColumns = withTitle(
      transformObjectDataIntoArray(columnsCopy, "values"),
      !rows.length,
      saveStructureHandler
    );

    setColumns(transformedColumns);
    cb({ [propName]: getColumnsTypeObj(transformedColumns) });
  };

  const createColumnHandler = () => {
    if (isInvalidColumnAvailable(columns)) {
      alert("Please fill current column before trying to create news");
      return;
    }

    const emptyColumn = {
      dataIndex: "",
      width: "25%",
      editable: true,
      type: "",
      uid: uuidv4(),
    };

    const transformedColumns = withTitle(
      transformObjectDataIntoArray([...columns, emptyColumn], "values"),
      !rows.length,
      saveStructureHandler
    );

    setColumns(transformedColumns);
  };

  const editColumnHandler = (columns, oldName, uid, { name, type, value }) => {
    if (isDuplicateColumnAvailable(columns, { name, uid })) {
      alert("Duplicate column");
      return;
    }

    const columnsCopy = [...columns];
    for (let i = 0; i < columnsCopy.length; ++i) {
      if (
        columnsCopy[i].dataIndex === oldName ||
        columnsCopy[i].dataIndex === ""
      ) {
        columnsCopy[i] = {
          ...columnsCopy[i],
          dataIndex: name,
          type,
          value,
        };
        break;
      }
    }

    const transformedColumns = withTitle(
      transformObjectDataIntoArray(columnsCopy, "values"),
      !rows.length,
      saveStructureHandler
    );

    setColumns(transformedColumns);
    cb({ [propName]: getColumnsTypeObj(transformedColumns) });
  };

  const deleteRowHandler = (rowId) => {
    const specificDataCopy = { ...specificData };
    const keys = Object.keys(specificData);
    for (let i = 0; i < keys.length; ++i) {
      const extractedKey = keys[i].split("-")[0];
      if (extractedKey == rowId) {
        const newData = filterObjectByKey(specificDataCopy, keys[i]);
        setSpecificData(newData);
        break;
      }
    }

    const updatedRows = [...rows].filter(({ key }, idx) => key !== rowId);

    setRows(updatedRows);
  };

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
      const row = await form.validateFields();
      setForFocus({});
      const newData = [...rows];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }

      setRows(newData);
    } catch (errInfo) {
      const errors = form.getFieldsError();
      resetErrors(errors, key);
    }
  };

  const mergedColumns = [
    ...columns,
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
        setRows,
        rows,
        specificData,
        setSpecificData,
        isEditableRowAvailable: editingKey === "",
        save,
        forFocus,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Button
        onClick={createColumnHandler}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 10,
        }}
      >
        Add a Column
      </Button>
      <If
        condition={Boolean(
          columns.length && !isInvalidColumnAvailable(columns)
        )}
      >
        <Then>
          <Button
            onClick={saveStructureHandler}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Save Table data
          </Button>
        </Then>
      </If>

      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={rows}
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

// eslint-disable-next-line no-lone-blocks
{
  /* <If condition={columns.length > 0 && !isInvalidColumnAvailable(columns)}>
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
      </If> */
}
