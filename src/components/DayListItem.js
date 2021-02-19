import React from "react";
import "components/DayListItem.scss";
const classNames = require('classnames');

export default function DayListItem(props){

  const formatSpots = function (spots) {
    let numSpots = spots;
    let spotTxt = 'spots'
    if (spots === 0){
      numSpots = 'no';
    } else if (spots === 1){
      spotTxt = 'spot'
    }
    return `${numSpots} ${spotTxt} remaining`;
  }

  let dayListItemClass = classNames(
    "day-list__item", {
      "day-list__item--selected": props.selected,
      "day-list__item--full": props.spots===0
    });

  return(
    <li className={dayListItemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
};