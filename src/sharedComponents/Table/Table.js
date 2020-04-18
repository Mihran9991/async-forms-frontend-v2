import React, { useState, useEffect } from "react";
import { Table as TableBT, Button } from "react-bootstrap";
import { If, Then } from "react-if";
import remove from "lodash/remove";
import isEmpty from "lodash/isEmpty";

import Header from "../../sharedComponents/Table/Header";
import Body from "../../sharedComponents/Table/Body";

function Table({ title, columns, rows }) {
  const [tableData, setTableData] = useState({
    title,
    columns,
    rows,
  });

  const deleteRowHandler = (id) => {
    const updatedRows = remove(
      rows,
      (_, deletableItemIdx) => id === deletableItemIdx
    );

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

  console.log(tableData);

  return (
    <>
      <TableBT striped bordered hover responsive variant="dark">
        <Header columns={columns} />
        <Body rows={rows} deleteRowHandler={deleteRowHandler} />
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
