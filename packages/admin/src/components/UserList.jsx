import React, { useEffect } from "react";
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Loading, useWindowSize } from "@shiksha/common-lib";
import { Box, Button, View } from "native-base";
import { useNavigate } from "react-router-dom";

const UserList = ({ users }) => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: "name" },
    { field: "role" },
    { field: "email" },
    {
      field: "Actions",
      cellRenderer: MyEditButtonRenderer,
    },
  ]);

  useEffect(() => {
    if (users.length) {
      setRowData(users);
    }
  }, [users]);

  function MyEditButtonRenderer(params) {
    return (
      <Button
        m={2}
        size={"xs"}
        onPress={() => {
          navigate("/admin/users/edit", { state: params.data });
        }}
      >
        Edit
      </Button>
    );
  }

  return (
    <>
      <View
        m={4}
        style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}
      >
        <Button onPress={() => navigate("/admin/users/add")}>
          Add Student
        </Button>
      </View>

      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          overlayNoRowsTemplate={"<span>Loading Student records....</span>"}
        ></AgGridReact>
      </div>
    </>
  );
};

export default UserList;
