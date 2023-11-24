import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, View } from "native-base";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UserList = ({ users }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: "name" },
    { field: "role" },
    { field: "email" },
    {
      field: "Actions",
      cellRenderer: EditButtonRenderer,
    },
  ]);

  useEffect(() => {
    if (users.length) {
      setRowData(users);
    }
  }, [users]);

  function EditButtonRenderer(params) {
    return (
      <Button
        m={2}
        size={"xs"}
        onPress={() => {
          navigate("/admin/users/edit", { state: params.data });
        }}
      >
        {t("EDIT")}
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
          {t("ADD_STUDENT")}
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
