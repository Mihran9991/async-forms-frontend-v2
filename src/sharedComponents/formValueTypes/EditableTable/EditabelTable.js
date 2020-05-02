/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState, useEffect } from "react";
import { If, Then, Else } from "react-if";
import { Table, Form, Button, message, Spin } from "antd";
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
import { INVALID_COLUMN } from "../../../constants/errorMessages";

const customizedColumns = ({
  columns,
  editable,
  saveStructureHandler,
  editColumnHandler,
  deleteColumnByNameHandler,
  cb,
  propName,
  structure,
}) => {
  const title = [...columns].reduce((acc, col) => {
    // console.log("col", col);
    return [
      ...acc,
      {
        ...col,
        title: () => (
          <Title
            editColumnHandler={(...args) => {
              editColumnHandler(columns, ...args);
            }}
            // TODO:: use lodash get
            deleteColumnByNameHandler={deleteColumnByNameHandler}
            saveStructureHandler={saveStructureHandler}
            cb={cb}
            propName={propName}
            columns={columns}
            name={col.dataIndex || col.name || ""}
            editable={editable}
            type={col.type}
            uid={col.uid}
            // TODO :: !!!!!!!!!!! fields ? , and on reomve data value is table :D
            data={get(col, "type.values", [])}
            structure={structure}
          />
        ),
      },
    ];
  }, []);

  return title;
};

const EditableTable = ({
  cb,
  propName,
  saveStructureHandler,
  rows: rowsFromProps,
  columns: columnsFromProps,
  forInstance,
}) => {
  const [form] = Form.useForm();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [rows, setRows] = useState(rowsFromProps || []);
  const [columns, setColumns] = useState(
    get(columnsFromProps, "length", false) ? columnsFromProps : []
  );

  const createRowHandler = () => {
    const key = uuidv4();
    setRows([...rows, generateRowByColumns(columns, key)]);
  };

  const editRowHandler = (rowId, editedData) => {
    const updatedRows = [...rows].reduce((acc, row) => {
      if (row.key === rowId) {
        return [...acc, { ...row, ...editedData }];
      }

      return [...acc, row];
    }, []);

    setRows(updatedRows);
    //TODO:: socket(FILED_SAVE, {formId, rowId, columnId, editedData)
  };

  // const editRowHandler = () => {
  //   console.log("editRowHandler");
  //   // TODO:: socket(FILED_EDIT, {formId, rowId, columnId)
  // };

  const deleteRowHandler = (rowId) => {
    const updatedRows = [...rows].filter((row) => {
      return row.key !== rowId;
    });

    setRows(updatedRows);
  };

  const createColumnHandler = () => {
    if (isInvalidColumnAvailable(columns)) {
      message.error(INVALID_COLUMN);
      return;
    }

    const emptyColumn = {
      dataIndex: "",
      width: 250,
      editable: true,
      type: "",
      uid: uuidv4(),
    };

    const transformedColumns = transformObjectDataIntoArray(
      [
        ...columns,
        { ...emptyColumn, [columns.length < 3 && "fixed"]: "right" },
      ],
      "values"
    );

    // cb({ [propName]: getColumnsTypeObj(transformedColumns) });
    setColumns(transformedColumns);
    setIsSaved();
  };

  const deleteColumnByNameHandler = (id) => {
    const columnsCopy = [...columns].filter((col) => {
      if (!col.dataIndex && !col.name) {
        return false;
      }

      if (col.dataIndex === undefined) {
        return col.name !== id;
      }

      return col.dataIndex !== id;
    });

    setColumns(columnsCopy);
    cb({ [propName]: getColumnsTypeObj(columnsCopy) });
    setIsSaved();
  };

  const editColumnHandler = (columns, oldName, uid, { name, type, value }) => {
    if (isDuplicateColumnAvailable(columns, { name, uid })) {
      alert("Duplicate column");
      return;
    }

    const columnsCopy = [...columns];
    for (let i = 0; i < columnsCopy.length; ++i) {
      if (
        columnsCopy[i].dataIndex === "" ||
        columnsCopy[i].dataIndex === oldName ||
        columnsCopy[i].name === oldName
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

    const transformedColumns = transformObjectDataIntoArray(
      columnsCopy,
      "values"
    );

    setColumns(transformedColumns);
    cb({ [propName]: getColumnsTypeObj(transformedColumns) });
    setIsSaved();
  };

  const mergedColumns = [
    ...customizedColumns({
      columns: columns,
      editable: !forInstance,
      saveStructureHandler,
      editColumnHandler,
      deleteColumnByNameHandler,
      cb,
      propName,
    }),
    {
      title: OPERATION,
      dataIndex: OPERATION,
      fixed: "right",
      width: 150,
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
        // saveRowHandler,
        editRowHandler,
      }),
    };
  });

  return (
    <Spin spinning={isSpinning}>
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
              onClick={() => {
                saveStructureHandler();
                setIsSpinning(true);
                setIsSaved(true);
                setTimeout(() => setIsSpinning(false), 1500);
              }}
              type="primary"
              disabled={isSaved}
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
            onChange: () => {},
          }}
          scroll={{ x: mergedColumns > 20 ? 2500 : 600 }}
        />
      </Form>
    </Spin>
  );
};

export default EditableTable;

/* <If
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
      </If> */

// const cancel = () => {
//   setEditingKey("");
// };

// withTitle(
//   transformObjectDataIntoArray(columnsCopy, "values"),
//   !rows.length,
//   saveStructureHandler
// );

// const isEditing = (record) => editingKey === "" || record.key === editingKey;

// const edit = (record) => {
//   form.setFieldsValue({
//     ...form.getFieldValue(),
//     ...record,
//   });

//   setEditingKey(record.key);
// };

// const resetErrors = (errors, key) => {
//   for (let i = 0; i < errors.length; ++i) {
//     if (errors[i].errors.length) {
//       setForFocus({ key, fieldName: errors[i].name[0] });
//       return;
//     }
//   }
// };

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
