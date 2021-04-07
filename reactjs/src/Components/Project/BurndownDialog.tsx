import React, {useEffect, useRef, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import c3, {ChartAPI, generate} from "c3";
import {getSprints} from "../../api/SprintService";
import {ISprint, IStory, ITask, ITaskUser} from "../ProjectList/IProjectList";
import moment from "moment";
import {getStories} from "../../api/UserStoriesService";
import {getTasks} from "../../api/TaskService";
import {getTaskUsers, postTaskUser} from "../../api/TaskUserService";

interface ITaskTimeRem {
  taskId: string;
  timestamp: number;
  timeRemaining: number;
}

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
        let taskTimeRem: ITaskTimeRem[] = [];
        for(let i = 0; i < tasks.length; i++) {
          const { timeEstimate, _id } = tasks[i];
          totalEstimate += timeEstimate;
          taskTimeRem.push({ taskId: _id, timestamp: 0, timeRemaining: timeEstimate });
        }

        let idealArray: number[] = [];
        for(let i = dataPointNum-1; i >= 0; i--) {
          idealArray.push(Math.floor(totalEstimate / (dataPointNum-1) * i));
        }

        setIdeal(idealArray);

        // Crate data array for actual chart

        // Get all time logs
        let taskUsers: ITaskUser[] = [];
        for(let i = 0; i < tasks.length; i++) {
          const taskUser = (await getTaskUsers(projectId, tasks[i].sprintId, tasks[i].storyId, tasks[i]._id)).data.data as ITaskUser[];
          taskUsers = [ ...taskUsers, ...taskUser ];
        }

        // Generate actual array
        let actualArray: number[] = [];

        // Iterate all the project days
        for(let i = 0; i < daysArray.length; i++) {
          const curDay = moment.unix(daysArray[i]).format("DD.MM.YYYY");

          // Iterate all the time logs
          for(let j = 0; j < taskUsers.length; j++) {
            const curLogDay = moment.unix(taskUsers[j].timestamp).format("DD.MM.YYYY");

            // Found log for current day, update time remaining for this task
            if(curDay === curLogDay) {
              for(let k = 0; k < taskTimeRem.length; k++) {
                // Found the task
                // If more logs are made on the same day take the last one (second condition)
                if(taskUsers[j].taskId === taskTimeRem[k].taskId && taskUsers[j].timestamp > taskTimeRem[k].timestamp) {
                  taskTimeRem[k].timeRemaining = taskUsers[j].timeRemaining;
                  break;
                }
              }
            }
          }

          // Calculate remining time
          const totalRemaining = taskTimeRemSum(taskTimeRem);
          actualArray.push(totalRemaining);

          // Only have to iterate until today
          if(moment().format("DD.MM.YYYY") === curDay) {
            break;
          }
        }

        setActual(actualArray);
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
            label: {
              text: "Project Days",
              position: "inner-right"
            },
            tick: {
              format: (x: any) => moment.unix(x).format("DD.MM.YYYY")
            }
          },
          y: {
            label: {
              text: "Time Remaining",
              position: "outer-middle"
            },
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

  const taskTimeRemSum = (taskTimeRem: ITaskTimeRem[]) => {
    let sum = 0;
    taskTimeRem.forEach(val => sum += val.timeRemaining);
    return sum;
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