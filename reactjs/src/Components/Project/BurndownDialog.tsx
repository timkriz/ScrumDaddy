import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import c3, {ChartAPI, generate} from "c3";
import {getSprints} from "../../api/SprintService";
import {ISprint, IStory, ITask} from "../ProjectList/IProjectList";
import moment from "moment";
import {getStories} from "../../api/UserStoriesService";
import {getTasks} from "../../api/TaskService";

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
  const [ideal, setIdeal] = useState<number[]>();
  const [actual, setActual] = useState<number[]>();

  // Fetch chart data
  useEffect(() => {
    const fetch = async () => {
      const sprints = (await getSprints(projectId)).data.data as ISprint[];

      if(sprints.length > 0) {
        // Create data array for x axis
        const sortedSprints = sprints.sort((a, b) => a.startTime - b.startTime);
        let startTime = sortedSprints[0].startTime;
        const endTime = sortedSprints[sortedSprints.length-1].endTime;

        let daysArray = [];

        while(startTime < endTime) {
          daysArray.push(startTime);
          startTime = moment.unix(startTime).add(1, "day").unix();
        }

        setDays(daysArray);

        const dataPointNum = daysArray.length;

        // Create data array for ideal chart

        let stories: IStory[] = [];
        for(let i = 0; i < sprints.length; i++) {
          const sprintStories = (await getStories(projectId, sprints[i]._id)).data.data as IStory[];
          stories = [ ...stories, ...sprintStories ];
        }

        let tasks: ITask[] = [];
        for(let i = 0; i < stories.length; i++) {
          const storyTasks = (await getTasks(projectId, stories[i].sprintId, stories[i]._id)).data.data as ITask[];
          tasks = [ ...tasks, ...storyTasks ];
        }

        let totalEstimate = 0;
        for(let i = 0; i < tasks.length; i++) {
          totalEstimate += tasks[i].timeEstimate;
        }

        let idealArray: number[] = [];
        for(let i = dataPointNum-1; i >= 0; i--) {
          idealArray.push(Math.floor(totalEstimate / (dataPointNum-1) * i));
        }

        setIdeal(idealArray);

        // Crate data array for actual chart

        setActual([100, 200, 300, 300, 300, 350, 350, 400, 400, 400, 400, 400]);
      }
    }
    fetch();
  }, []);

  // Populate chart
  useEffect(() => {
    if(chart !== undefined && days !== undefined && ideal !== undefined && actual !== undefined) {
      chart.load({
        columns: [
          [ChartData.XAXIS, ...days],
          [ChartData.IDEAL, ...ideal],
          [ChartData.ACTUAL, ...actual]
        ]
      })
    }
  }, [chart, days, ideal, actual]);

  // Generate chart
  const onRefChange = (chartRef: HTMLDivElement | null) => {
    generateChart(chartRef);
  }

  const generateChart = (chartRef: HTMLDivElement | null) => {
    if(chartRef !== null && chart === undefined && open) {
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
        },
        point: {
          r: 1.5
        }
      });

      setChart(generated);
    }
  }

  const onClose = () => {
    setChart(undefined);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Burndown Chart</DialogTitle>
      <DialogContent>
        <div id="burndown_chart" ref={onRefChange} />
      </DialogContent>
    </Dialog>
  )
}