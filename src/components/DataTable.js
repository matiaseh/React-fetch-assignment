import { DataGrid } from "@material-ui/data-grid";
import React from "react";

const columns = [
  {
    field: "conversation_count",
    headerName: "conversation_count",
    width: 200,
  },
  {
    field: "missed_chat_count",
    headerName: "missed_chat_count",
    width: 200,
  },
  {
    field: "visitors_with_conversation_count",
    headerName: "visitors_with_conversation_count",
    width: 300,
  },
  {
    field: "date",
    headerName: "Date",
    width: 200,
  },
];

const DataTable = (props) => {
  const rows = props.rows;

  return (
    <div style={{ height: 335, margin: "15px" }}>
      <DataGrid rows={rows} columns={columns} pageSize={4} />
    </div>
  );
};

export default DataTable;
