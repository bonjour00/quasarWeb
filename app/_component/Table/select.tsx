import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useQA from "./useMessage";

export default function SelectOption({ props }: any) {
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
  const [select, setSelect] = useState(
    props.label === "指派系所" ? props.currentAssign : props.order
  );

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value);
    props.label === "指派系所"
      ? setSelectOffice(event.target.value)
      : setSelectOrder(event.target.value);
  };
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">{props.label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={select}
        label="Age"
        onChange={handleChange}
      >
        {props.options.map((x: any) => (
          <MenuItem value={x.value} key={x.value}>
            {x.title}
          </MenuItem>
        ))}
      </Select>
      {/* <button onClick={(()=>)}></button> */}
    </FormControl>
  );
}
