import moment from "moment";
export const columns = [
  {
    field: "question",
    headerName: "問題",
    width: 800,
  },
  { field: "stuNum", headerName: "發問者學號", width: 350 },
  {
    field: "qaAskTime",
    headerName: "發問時間",
    width: 400,
    renderCell: (params: any) => {
      return <div>{moment(params.row.qaAskTime.toDate()).format("LLL")}</div>;
    },
  },
];
