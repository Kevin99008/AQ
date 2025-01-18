// components/Timeline.js

import Timeline from "react-calendar-timeline";

const items = [
  { id: 1, group: 1, title: "Item 1", start_time: new Date(2025, 0, 1).getTime(), end_time: new Date(2025, 0, 5).getTime() },
  { id: 2, group: 2, title: "Item 2", start_time: new Date(2025, 0, 2).getTime(), end_time: new Date(2025, 0, 6).getTime() },
  { id: 3, group: 1, title: "Item 3", start_time: new Date(2025, 0, 4).getTime(), end_time: new Date(2025, 0, 8).getTime() },
];

const groups = [
  { id: 1, title: "Group 1" },
  { id: 2, title: "Group 2" },
];

const MyTimeline = () => {
  return (
    <div style={{ height: "500px" }}>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={new Date(2025, 0, 1).getTime()} // Convert Date to timestamp
        defaultTimeEnd={new Date(2025, 0, 10).getTime()} 
      />
    </div>
  );
};

export default MyTimeline;
