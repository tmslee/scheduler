import React from "react";
import DayListItem from "./DayListItem";

export default function Button(props) {
  const {days, day, setDay} = props;

  const dayList = days.map(dayItem => {
    return (
    <DayListItem
      key={dayItem.id}
      name={dayItem.name}
      spots={dayItem.spots}
      selected={dayItem.name === day}
      setDay={setDay}
    />
    );
  });

  return ( 
    <ul>
      {dayList};
    </ul>
  );
}