import React, { useState, useEffect } from "react";
import { Table as TableBT, Button } from "react-bootstrap";
import { If, Then } from "react-if";
import isEmpty from "lodash/isEmpty";

import Header from "../../sharedComponents/Table/Header";
import Body from "../../sharedComponents/Table/Body";

function Table({
  title,
  columns,
  rows,
  createRowHandler,
  deleteRowHandler,
  editRowHandler,
  editColumnHandler,
  deleteColumnByNameHandler,
  createColumnHandler,
  isInvalidColumnAvailable,
}) {
  const [tableData, setTableData] = useState({
    title,
    columns,
    rows,
  });

  const isTableReadyForSubmit = !(
    isEmpty(title) ||
    isEmpty(columns) ||
    isEmpty(rows)
  );

  useEffect(() => {
    setTableData({
      title,
      columns,
      rows,
    });
  }, [title, columns, rows]);

  return (
    <If condition={title.length > 0}>
      <Then>
        <h2>{title}</h2>
        <If condition={!isEmpty(columns) && !isInvalidColumnAvailable}>
          <Button variant="outline-success" onClick={createRowHandler}>
            Add Row
          </Button>
        </If>
        <Button variant="outline-success" onClick={createColumnHandler}>
          Add Column
        </Button>
        <TableBT
          striped
          bordered
          hover
          responsive
          //  variant="dark"
        >
          <Header
            columns={columns}
            editable={!rows.length}
            editColumnHandler={editColumnHandler}
            deleteColumnByNameHandler={deleteColumnByNameHandler}
          />
          <Body
            rows={rows}
            deleteRowHandler={deleteRowHandler}
            editRowHandler={editRowHandler}
          />
        </TableBT>

        <If condition={isTableReadyForSubmit}>
          <Then>
            <Button
              variant="outline-success"
              onClick={() => {
                console.log(tableData);
              }}
            >
              Save Table
            </Button>
          </Then>
        </If>
      </Then>
    </If>
  );
}

export default Table;
