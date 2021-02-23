import React from "react";
import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";
import PropTypes from "prop-types";

function InterviewerList(props) {
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

InterviewerList.propTypes = {
  interviewers: PropTypes.array.isRequired
};

export default InterviewerList;