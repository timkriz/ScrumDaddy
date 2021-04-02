import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import c3, {ChartAPI} from "c3";

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default ({ open, handleClose }: IProps) => {
  const [chart, setChart] = useState<ChartAPI>();

  // Generate chart
  const onRefChange = (chartRef: HTMLDivElement | null) => {
    if(chartRef !== null && chart === undefined) {
      const generated = c3.generate({
        bindto: '#burndown_chart',
        data: {
          columns: [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
          ]
        }
      });

      setChart(generated);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Burndown Chart</DialogTitle>
      <DialogContent>
        <div id="burndown_chart" ref={onRefChange} />
      </DialogContent>
    </Dialog>
  )
}