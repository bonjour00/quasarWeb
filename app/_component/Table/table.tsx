"use client";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { columns } from "./colums";
import useQA from "./useMessage";
import PaginationControlled from "@/app/page/page";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { QA } from "@/app/_settings/interface";
import DialogModel from "./dialog";
import SelectOption from "./select";

export default function Table() {
  const [
    QaList,
    createQA,
    deleteQA,
    updateQA,
    selectOffice,
    selectOrder,
    setSelectOffice,
    setSelectOrder,
  ] = useQA();

  const PAGE_SIZE = 3;
  const [paginationModel, setPaginationModel] = useState({
    pageSize: PAGE_SIZE,
    page: 0,
  });
  const [editSelected, setEditSelected] = useState<QA>();
  const [open, setOpen] = useState(false);

  const props = {
    open,
    setOpen,
    editSelected,
    setEditSelected,
    label: "指派系所",
    options: [
      { value: "1", title: "資管" },
      { value: "2", title: "統資" },
      { value: "3", title: "圖資" },
    ],
  };

  const propsOrder = {
    label: "順序",
    options: [
      { value: "desc", title: "最新" },
      { value: "asc", title: "最舊" },
    ],
    order: "desc",
  };

  const editPop = (selectedRow: QA) => {
    setEditSelected(selectedRow);
    setOpen(true);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "選項",
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <div>
          <IconButton aria-label="edit" onClick={() => editPop(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => deleteQA(params.row.qaId)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#F7F9FE",
        padding: "3rem",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        className=""
        style={{
          background: "#FFFFFF",
          padding: "1rem",
          height: "calc(100% - 1rem)",
          borderRadius: "1rem",
          boxShadow: "0px 10px 20px #E8E8E8",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              fontSize: "30px",
              margin: "0.5rem 1rem 0rem 1rem",
            }}
          >
            尚未確認問題
          </p>
          <SelectOption props={propsOrder} />
        </div>
        <div style={{ height: "calc(100% - 5rem)", overflow: "auto" }}>
          <DataGrid
            rows={QaList}
            columns={columns.concat(actionColumn)}
            disableColumnMenu
            disableRowSelectionOnClick
            slots={{
              pagination: PaginationControlled,
            }}
            pageSizeOptions={[PAGE_SIZE]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>
      </div>
      <DialogModel props={props} />
    </div>
  );
}
