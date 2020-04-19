import React, { useState, useEffect } from "react";
import { Table as TableBT, Button } from "react-bootstrap";
import { If, Then } from "react-if";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";

import Header from "../../sharedComponents/Table/Header";
import Body from "../../sharedComponents/Table/Body";
import styles from "./table.module.scss";

function Table({ title, columns, rows, editRowHandler }) {
  const [tableData, setTableData] = useState({
    title,
    columns,
    rows,
  });

  const deleteRowHandler = (deletableItemIdx) => {
    const updatedRows = filter([...rows], (_, id) => id !== deletableItemIdx);

    console.log("updatedRows ------>", updatedRows);

    setTableData({
      ...tableData,
      rows: updatedRows,
    });
  };

  useEffect(() => {
    setTableData({
      title,
      columns,
      rows,
    });
  }, [title, columns, rows]);

  return (
    <>
      <TableBT
        striped
        bordered
        hover
        responsive
        variant="dark"
        className={styles["table"]}
      >
        <Header columns={columns} />
        <Body
          rows={rows}
          deleteRowHandler={deleteRowHandler}
          editRowHandler={editRowHandler}
        />
      </TableBT>
      <If condition={!(isEmpty(title) || isEmpty(columns) || isEmpty(rows))}>
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
    </>
  );
}

export default Table;
