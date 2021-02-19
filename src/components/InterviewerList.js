import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";



export default function InterviewerList(props) {
  const {interviewers, value, onChange} = props;

  const interviewerList = interviewers.map(interviewerItem => {
    return (
      <InterviewerListItem
        key={interviewerItem.id}
        name={interviewerItem.name}
        avatar={interviewerItem.avatar}
        selected={value === interviewerItem.id}
        setInterviewer={event => onChange(interviewerItem.id)}
      />
    );
  });

  return ( 
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerList}
      </ul>
    </section>
  );
}