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
  // console.log("selectOffice", selectOffice, "selectOrder", selectOrder);
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
      renderCell: (params: any) => {
        return (
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
        );
      },
    },
  ];

  console.log(editSelected);
  return (
    <>
      <SelectOption props={propsOrder} />
      <DataGrid
        autoHeight
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
        // loading={true}
      />
      <DialogModel props={props} />
    </>
  );
}
