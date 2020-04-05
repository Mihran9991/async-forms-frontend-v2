import React, { useState } from "react";
import { Table as TableBT } from "react-bootstrap";
import styles from "./table.module.scss";

function Table({ columns }) {
  const [tableData, setTableData] = useState({
    columns,
  });

  return (
    <TableBT striped bordered hover responsive variant="dark">
      <thead>
        <tr>
          <th>#</th>
          {columns.map(({ name }) => {
            return <th>{name}</th>;
          })}
        </tr>
      </thead>
    </TableBT>
  );
}

export default Table;
