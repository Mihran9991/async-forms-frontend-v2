import React, { useState, useEffect } from "react";
import { Table as TableBT } from "react-bootstrap";
import styles from "./table.module.scss";
import Header from "../../sharedComponents/Table/Header";
import Body from "../../sharedComponents/Table/Body";

function Table({ title, columns, rows }) {
  const [tableData, setTableData] = useState({
    title,
    columns,
    rows,
  });

  useEffect(() => {
    setTableData({
      title,
      columns,
      rows,
    });
  }, [title, columns, rows]);

  return (
    <TableBT striped bordered hover responsive variant="dark">
      <Header columns={columns} />
      <Body rows={rows} />
    </TableBT>
  );
}

export default Table;
