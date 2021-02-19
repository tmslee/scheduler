import React from "react";
import "components/InterviewerListItem.scss";
const classNames = require('classnames');

export default function InterviewerListItem(props) {

  const itemClass = classNames(
    "interviewers__item",
    {
      "interviewers__item--selected": props.selected
    }
  );
  const imgClass = classNames(
    "interviewers__item-image",
    {
      "interviewers__item--selected-image": props.selected
    }
  );
  
  return(
    <li className={itemClass} onClick={props.setInterviewer}>
      <img
        className={imgClass}
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  );
};