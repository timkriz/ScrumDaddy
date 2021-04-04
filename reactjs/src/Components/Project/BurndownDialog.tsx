import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import c3, {ChartAPI} from "c3";
import {getSprints} from "../../api/SprintService";
import {ISprint} from "../ProjectList/IProjectList";
import moment from "moment";

interface IProps {
  projectId: string;
  open: boolean;
  handleClose: () => void;
}

export enum ChartData {
  XAXIS = "XAXIS",
  IDEAL = "IDEAL",
  ACTUAL = "ACTUAL"
}

export default ({ projectId, open, handleClose }: IProps) => {
  const [chart, setChart] = useState<ChartAPI>();
  const [days, setDays] = useState<number[]>();

  // Fetch chart data
  useEffect(() => {
    const fetch = async () => {
      const sprints = (await getSprints(projectId)).data.data as ISprint[];

      if(sprints.length > 0) {
        const sortedSprints = sprints.sort((a, b) => a.startTime - b.startTime);
        let startTime = sortedSprints[0].startTime;
        const endTime = sortedSprints[sortedSprints.length-1].endTime;

        let days = [];

        while(startTime < endTime) {
          days.push(startTime);
          startTime = moment.unix(startTime).add(1, "day").unix();
        }

        setDays(days);
      }
    }
    fetch();
  }, []);

  // Populate chart
  useEffect(() => {
    if(days !== undefined && chart !== undefined) {
      console.log(days);
      chart.load({
        columns: [
          [ChartData.XAXIS, ...days],
          [ChartData.IDEAL, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        ]
      })
    }
  }, [days, chart]);

  // Generate chart
  const onRefChange = (chartRef: HTMLDivElement | null) => {
    if(chartRef !== null && chart === undefined) {
      const generated = c3.generate({
        bindto: '#burndown_chart',
        data: {
          x: ChartData.XAXIS,
          columns: [],
          names: {
            [ChartData.IDEAL]: 'Ideal',
            [ChartData.ACTUAL]: 'Actual',
          }
        },
        axis : {
          x : {
            tick: {
              format: (x: any) => moment.unix(x).format("DD.MM.YYYY")
            }
          }
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