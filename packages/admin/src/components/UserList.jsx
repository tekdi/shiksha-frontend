import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import EditBoxLineIcon from "remixicon-react/EditBoxLineIcon";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, HStack, View } from "native-base";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconByName } from "@shiksha/common-lib";

const UserList = ({ users }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const [columnDefs] = useState([
    { field: "name" },
    { field: "role", width: 150, cellClass: 'text-capitalize' },
    { field: "email", width: 250 },
    {
      field: "Actions",
      cellRenderer: EditButtonRenderer,
      width: 200,
    },
  ]);

  useEffect(() => {
    if (users.length) {
      setRowData(users);
    }
  }, [users]);

  function EditButtonRenderer(params) {
    return (
      <HStack>
        <Button
          m={2}
          size={"xs"}
          onPress={() => {
            navigate("/admin/users/edit", { state: params.data });
          }}
        >
          {t("EDIT")}
        </Button>

        <Button
          disabled
          colorScheme="red"
          variant="outline"
          m={2}
          size={"xs"}
          onPress={() => {
            navigate("/admin/users/edit", { state: params.data });
          }}
        >
          {t("DELETE")}
        </Button>
      </HStack>
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

      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: "100%", marginBottom: "20px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          overlayNoRowsTemplate={
            "<span>" + t("LOADING_STUDENT_RECORDS") + "</span>"
          }
          rowHeight={50}
        ></AgGridReact>
      </div>
    </>
  );
};

export default UserList;
