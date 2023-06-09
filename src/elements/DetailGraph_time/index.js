import React from 'react';
import Plot from 'react-plotly.js';
// import routineResults from '../../routineInfos/routineResults';
import morningRoutineResults from '../../routineInfos/morningRoutineResults';
import dayRoutineResults from '../../routineInfos/dayRoutineResults';
import nightRoutineResults from '../../routineInfos/nightRoutineResults';

import './style.css';

// const morningRoutineResultsSliced = morningRoutineResults.slice(4, 18);

const URLSplit = window.document.URL.split('/');
let timezone = 'morning';
let routine = 'WakeUp';
if (URLSplit.length >= 6) {
  timezone = URLSplit[URLSplit.length - 2];
  routine = URLSplit[URLSplit.length - 1];
}

const routinesets = {
  WakeUp: ['wakeUpTime', 'Daily wake up time'],
  SNSUsage: ['totalTimeForeground', 'Daily SNS usage time'],
  UVExposure: ['UVExposureTime', 'Daily UV exposure time'],
  study: ['studyTime', 'Daily study time'],
  step: ['totalStep', 'Daily Step Count'],
};
const routinename = routinesets[routine][0];

const colorsets = {
  morning: ['#FFCA2D', '#FFE9A9'],
  day: ['#8CD735', '#D8EDC0'],
  night: ['#3F51B5', '#CED3F0'],
};

let FilteredroutineResults;

if (timezone === 'morning') {
  FilteredroutineResults = morningRoutineResults.filter(
    ({ userID }) => userID === 'USER1'
  );
} else if (timezone === 'day') {
  FilteredroutineResults = dayRoutineResults.filter(
    ({ userID }) => userID === 'USER1'
  );
} else {
  FilteredroutineResults = nightRoutineResults.filter(
    ({ userID }) => userID === 'USER1'
  );
}

const routineResults = {};

FilteredroutineResults.forEach((obj) => {
  const { date, ...data } = obj;
  routineResults[date] = data;
});

const practicedDatesStr = Object.keys(routineResults);
const practicedDates = practicedDatesStr.map(
  (str) => new Date(str).toISOString().split('T')[0]
);

const wakeUpTimes = practicedDatesStr.map((str) => {
  const timeStr = routineResults[str][routinename];
  if (routinename == 'wakeUpTime' || routinename == 'UVExposureTime') {
    const [hours, minutes, seconds] = timeStr.split(':');
    return new Date(2019, 0, 1, hours, minutes, seconds);
  }
  // const [hours, minutes, seconds] = timeStr.split(':');
  return new Date(2019, 0, 1, 0, 0, 0);
});

const markerColors = wakeUpTimes.map((time) => {
  let wakeUpTime = new Date(time);
  let targetTime = new Date(2019, 0, 1, 9, 0, 0); // Target wake up time at 09:00

  // if (wakeUpTime < targetTime) {
  //   return colorsets[timezone][0]; // Use colorsets[timezone][0] if wakeUpTime is earlier than 08:30
  // } else {
  //   return "FFFFFF"; // Use FFFFFF if wakeUpTime is 08:30 or later
  // }

  if (timezone == 'morning') {
    if (wakeUpTime < targetTime) {
      return colorsets[timezone][0]; // Use colorsets[timezone][0] if wakeUpTime is earlier than 08:30
    } else {
      return 'FFFFFF'; // Use FFFFFF if wakeUpTime is 08:30 or later
    }
  } else if (timezone == 'day') {
    targetTime = new Date(2019, 0, 1, 18, 0, 0);
    if (wakeUpTime < targetTime) {
      return colorsets[timezone][0]; // Use colorsets[timezone][0] if wakeUpTime is earlier than 08:30
    } else {
      return 'FFFFFF'; // Use FFFFFF if wakeUpTime is 08:30 or later
    }
  }
});

const markerlineColors = wakeUpTimes.map((time) => {
  const wakeUpTime = new Date(time);

  if (timezone == 'morning') {
    return colorsets[timezone][0];
  } else if (timezone == 'day') {
    const zeroTime = new Date(2019, 0, 1, 23, 59, 59);
    if (wakeUpTime.getTime() === zeroTime.getTime()) {
      // return 'rgba(255, 255, 255, 0.0)';
      return colorsets[timezone][0];
    }
    return colorsets[timezone][0];
  }
});

const mode = routine == 'morning' ? 'markers+lines' : 'markers+lines';

let scatterplot = {
  height: '1000px',
  type: 'scatter',
  x: practicedDates,
  y: wakeUpTimes,
  mode: mode,
  line: {
    color: colorsets[timezone][0],
    width: 2,
  },
  marker: {
    size: 8,
    color: markerColors,
    line: {
      color: markerlineColors,
      width: 2,
    },
  },
  name: 'My Data',
};

// let background = {
// x: practicedDates,
// y: Array.from({ length: 110 }, () => "09:00:00").map(time => '2019-01-01 ' + time),
// fill: 'tozeroy',
// fillcolor: colorsets[timezone][1],
// type: 'scatter',
// mode: 'none',
// name: 'Goal'
// }

let y;
if (timezone === 'morning') {
  y = Array.from({ length: 110 }, () => '09:00:00').map(
    (time) => '2019-01-01 ' + time
  );
} else if (timezone === 'day') {
  y = Array.from({ length: 110 }, () => '18:00:00').map(
    (time) => '2019-01-01 ' + time
  );
}

let background = {
  x: practicedDates,
  y: y,
  fill: 'tozeroy',
  fillcolor: colorsets[timezone][1],
  type: 'scatter',
  mode: 'none',
  name: 'Goal',
};

// let whitebackground = {
//   x: practicedDates,
//   y: Array.from({ length: 110 }, () => "12:00:00").map(time => '2019-01-01 ' + time),
//   fill: 'tozeroy',
//   fillcolor: 'ffffff',
//   type: 'scatter',
//   mode: 'none',
//   name: 'Goal'
// }

let y_adj;
if (timezone == 'morning') {
  y_adj = Array.from({ length: 14 }, (_, i) => {
    const time = new Date(`2019-01-01 ${'10:00:00'}`);
    // console.log(time.getHours());
    time.setMinutes(time.getMinutes() - i * 5);
    return '2019-01-01 ' + time.toLocaleTimeString('en-US', { hour12: false });
  });
}

let adjustmentbackground = {
  x: practicedDates,
  y: y_adj,
  fill: 'tozeroy',
  fillcolor: colorsets[timezone][1],
  type: 'scatter',
  mode: 'none',
  name: 'Goal',
};

let initial_range = ['2019-04-14', '2019-05-15'];

let layout = {
  showlegend: false,
  font: {
    size: 12,
  },
  xaxis: {
    //   rangeSelector: {buttons: [{
    //     step: 'all'
    // }]},
    rangeslider: {},
    range: initial_range,
  },
  // xaxis: {
  //   tickformat: '%H:%M:%S',
  // },
  yaxis: {
    // tickformat: '%H:%M:%S',
    title: {
      text: 'Time',
      font: {
        size: 16,
      },
    },
  },
  margin: {
    t: 30,
  },
};

const data =
  timezone == 'morning'
    ? [background, adjustmentbackground, scatterplot]
    : [background, scatterplot];

function DetailGraph() {
  let detailgraph = [];
  detailgraph.push(
    <div>
      <div className="title">
        {routinesets[routine][1]} <b>DETAILS</b>{' '}
        <div className="big-subtitle">
          This <b>detail graph</b> shows your routine achievement{' '}
          <b>in specific figures</b> on a <b>daily</b> basis.
        </div>
        <div className="sub-subtitle">
          Move the slider to check your achievement by period.
        </div>
      </div>
      <div className="legend-container">
        <div
          className="goal-color"
          style={{ backgroundColor: colorsets[timezone][1] }}
        ></div>
        <div className="legend-text">Goal</div>
      </div>
    </div>
  );

  detailgraph.push(
    <Plot className="graphContainer" data={data} layout={layout} />
  );
  return detailgraph;
}

export default DetailGraph;
