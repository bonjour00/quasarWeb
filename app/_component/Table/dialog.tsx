"use client";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SelectOption from "./select";

export default function DialogModel({ props }: any) {
  const hide = () => {
    props.setOpen(false);
  };
  const InputChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    props.setEditSelected({
      ...props.editSelected,
      [e.target.name]: e.target.value,
    });
  };
  const propsSelect = {
    options: props.options,
    label: props.label,
    currentAssign: props.editSelected && props.editSelected.officeId,
  };
  return (
    <Dialog open={props.open} onClose={hide}>
      <DialogTitle>修改</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="question"
          label="問題"
          fullWidth
          variant="standard"
          multiline
          value={props.editSelected && props.editSelected.question}
          onChange={InputChange}
        />
        <TextField
          margin="dense"
          name="answer"
          label="答案"
          fullWidth
          variant="standard"
          multiline
          value={props.editSelected && props.editSelected.answer}
          onChange={InputChange}
        />
      </DialogContent>
      <DialogActions>
        <SelectOption props={propsSelect} />
        <IconButton
          aria-label="close"
          onClick={hide}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Button onClick={hide}>取消</Button>
        <Button onClick={hide}>修改</Button>
      </DialogActions>
    </Dialog>
  );
}
