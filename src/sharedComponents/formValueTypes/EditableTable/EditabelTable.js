/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import React, { useState, useContext, useEffect } from "react";
import { If, Then, Else } from "react-if";
import { Table, Form, Button, message, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";

import EditableCell from "../../Form/EditableCell";
import {
  getColumnsTypeObj,
  isInvalidColumnAvailable,
  isDuplicateColumnAvailable,
  generateRowByColumns,
  reconstructDropDownData,
  customizedColumns,
} from "../../../utils/formUtil";
import { transformObjectDataIntoArray } from "../../../utils/dataTransformUtil";
import { OPERATION, DROP_DOWN } from "../../../constants/formConstants";
import {
  INVALID_COLUMN,
  DUPLICATE_COLUMN,
} from "../../../constants/errorMessages";
import socketContext from "../../WithSocket/socketContext";

const EditableTable = ({
  cb,
  propName,
  saveStructureHandler,
  rows: rowsFromProps,
  columns: columnsFromProps,
  forInstance,
  belongsTo,
  withLoading,
  currentUserEmail,
}) => {
  const [form] = Form.useForm();
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [rows, setRows] = useState(rowsFromProps || []);
  const [columns, setColumns] = useState(
    get(columnsFromProps, "length", false) ? columnsFromProps : []
  );
  const invalidColumnAvailabe = isInvalidColumnAvailable(columns);
  const socketData = useContext(socketContext);

  const createRowHandler = () => {
    setRows([...rows, generateRowByColumns(columns, uuidv4())]);
  };

  const editRowHandler = (rowId, editedData) => {
    const updatedRows = [...rows].reduce((acc, row) => {
      if (row.rowId === rowId) {
        return [...acc, { ...row, ...editedData }];
      }

      return [...acc, row];
    }, []);

    setRows(updatedRows);
  };

  const deleteRowHandler = (rowId) => {
    const updatedRows = [...rows].filter((row) => {
      return row.rowId !== rowId;
    });

    setRows(updatedRows);
  };

  const createColumnHandler = () => {
    if (invalidColumnAvailabe) {
      message.error(INVALID_COLUMN);
      return;
    }

    const emptyColumn = {
      dataIndex: "",
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
      message.error(DUPLICATE_COLUMN);
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
    // {
    //   title: OPERATION,
    //   dataIndex: OPERATION,
    //   fixed: "right",
    //   width: 150,
    //   render: (_, record) => {
    //     return (
    //       <Button
    //         type="danger"
    //         disabled={false}
    //         onClick={() => deleteRowHandler(record.key)}
    //       >
    //         Delete
    //       </Button>
    //     );
    //   },
    // },
  ].map((col) => {
    return {
      ...col,
      onCell: (record) => {
        const { instanceId, formId, fieldId, title, ownerId } = belongsTo;
        const cellId = `${record.rowId}-${col.dataIndex}`;
        const currentField = get(record, `${col.dataIndex}`, {});
        const isLocked = JSON.parse(get(currentField, `isLocked`, "false"));
        const lockedBy = get(currentField, `lockedBy`, "");
        const currentOwnerId = get(
          socketData,
          `${formId}.${instanceId}.${fieldId}.ownerId`,
          ""
        );
        const disabledBySocket = get(
          socketData,
          `${formId}.${instanceId}.${fieldId}.value`,
          new Set([])
        ).has(cellId);
        const disabled =
          disabledBySocket || (isLocked && lockedBy !== currentUserEmail);
        const info =
          lockedBy && lockedBy === currentUserEmail
            ? "This field has been locked by you!"
            : "";

        return {
          record,
          inputType: col.type,
          dataIndex: col.dataIndex,
          value:
            col.type === DROP_DOWN
              ? reconstructDropDownData(col.value)
              : col.value,
          editRowHandler,
          disabled,
          belongsTo: { ...belongsTo, formName: title, ownerId, currentOwnerId },
          withLoading,
          info,
        };
      },
    };
  });

  useEffect(() => {
    setRows(rowsFromProps);
  }, [rowsFromProps]);

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
        <If condition={Boolean(columns.length && !invalidColumnAvailabe)}>
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
