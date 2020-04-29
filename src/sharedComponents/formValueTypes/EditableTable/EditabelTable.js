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
  generateRowByColumns,
  reconstructDropDownData,
} from "../../../utils/formUtil";
import { transformObjectDataIntoArray } from "../../../utils/dataTransformUtil";
import { OPERATION, DROP_DOWN } from "../../../constants/formConstants";

const EditableTable = ({
  cb,
  propName,
  saveStructureHandler,
  structure,
  rows: rowsFromProps,
  columns: columnsFromProps,
  forInstance,
}) => {
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

  const [form] = Form.useForm();
  const [columns, setColumns] = useState(columnsFromProps || []);
  const [rows, setRows] = useState(rowsFromProps || []);
  const [editingKey, setEditingKey] = useState("");
  const [forFocus, setForFocus] = useState({});

  const createRowHandler = () => {
    const key = uuidv4();
    setRows([...rows, generateRowByColumns(columns, key)]);
  };

  const saveRowHandler = (rowId, editedData) => {
    const updatedRows = [...rows].reduce((acc, row) => {
      if (row.key === rowId) {
        return [...acc, { ...row, ...editedData }];
      }

      return [...acc, row];
    }, []);

    setRows(updatedRows);
    //TODO:: socket(FILED_SAVE, {formId, rowId, columnId, editedData)
  };

  const editRowHandler = () => {
    console.log("editRowHandler");
    // TODO:: socket(FILED_EDIT, {formId, rowId, columnId)
  };

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
    // const specificDataCopy = { ...specificData };
    // const keys = Object.keys(specificData);
    // for (let i = 0; i < keys.length; ++i) {
    //   const extractedKey = keys[i].split("-")[0];
    //   if (extractedKey == rowId) {
    //     const newData = filterObjectByKey(specificDataCopy, keys[i]);
    //     setSpecificData(newData);
    //     break;
    //   }
    // }
    console.log("rowId", rows);

    const updatedRows = [...rows].filter((row) => {
      console.log("row", row);
      return row.key !== rowId;
    });

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

  // const save = async (key) => {
  //   try {
  //     const row = await form.validateFields();
  //     setForFocus({});
  //     const newData = [...rows];
  //     const index = newData.findIndex((item) => key === item.key);

  //     if (index > -1) {
  //       const item = newData[index];
  //       newData.splice(index, 1, { ...item, ...row });
  //       setEditingKey("");
  //     } else {
  //       newData.push(row);
  //       setEditingKey("");
  //     }

  //     setRows(newData);
  //   } catch (errInfo) {
  //     const errors = form.getFieldsError();
  //     resetErrors(errors, key);
  //   }
  // };

  const mergedColumns = [
    ...columns,
    {
      title: OPERATION,
      dataIndex: OPERATION,
      render: (_, record) => {
        // const editable = isEditing(record);
        return (
          <Button
            type="danger"
            disabled={false}
            onClick={() => deleteRowHandler(record.key)}
          >
            Delete
          </Button>
          // <If condition={editable}>
          //   <Then>
          //     <span>
          //       <Button
          //         onClick={() => save(record.key)}
          //         style={{
          //           marginRight: 8,
          //         }}
          //       >
          //         Save
          //       </Button>
          //       <Button
          //         disabled={editingKey !== ""}
          //         onClick={() => deleteRowHandler(record.key)}
          //       >
          //         Delete
          //       </Button>
          //       {/* <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
          //         <a>Cancel</a>
          //       </Popconfirm> */}
          //     </span>
          //   </Then>
          //   <Else>
          //     <a disabled={editingKey !== ""} onClick={() => edit(record)}>
          //       Edit
          //     </a>
          //     {/* <a
          //       disabled={editingKey !== ""}
          //       onClick={() => deleteRowHandler(record.key)}
          //     >
          //       Delete
          //     </a> */}
          //   </Else>
          // </If>
        );
      },
    },
  ].map((col) => {
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.type,
        dataIndex: col.dataIndex,
        value:
          col.type === DROP_DOWN
            ? reconstructDropDownData(col.value)
            : col.value,
        saveRowHandler,
        editRowHandler,
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <If condition={Boolean(forInstance)}>
        <Then>
          <If condition={columns.length > 0}>
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
          </If>
        </Then>
        <Else>
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
        </Else>
      </If>
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
