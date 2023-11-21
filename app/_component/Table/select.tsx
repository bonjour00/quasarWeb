import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function SelectOption({ props }: any) {
  const [select, setSelect] = useState(props.currentAssign);
  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value);
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
    </FormControl>
  );
}

// import { useState, useEffect } from "react";
// import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select, { SelectChangeEvent } from "@mui/material/Select";

// export default function SelectOption({ props }: any) {
//   const [select, setSelect] = useState(props.currentAssign); //e.g.按照順序(desc,asc) 系所指派

//   const handleChange = (event: SelectChangeEvent) => {
//     setSelect(event.target.value);
//   };

//   return (
//     <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
//       {select}
//       <InputLabel id="demo-select-small-label">{props.label}</InputLabel>
//       <Select
//         labelId="demo-select-small-label"
//         id="demo-select-small"
//         value={select}
//         label={props.label}
//         onChange={handleChange}
//       >
//         {props.options&&props.options.map((x: any) => {
//           <MenuItem value={x.value}>{x.title}</MenuItem>;
//         })}
//       </Select>
//     </FormControl>
//   );
// }
