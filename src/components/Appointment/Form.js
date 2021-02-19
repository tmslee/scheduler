import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";

export default function Form(props) {
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [name, setName] = useState(props.name || "");

  const reset = function() {
    setInterviewer(null);
    setName("");
  };

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </form>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={
            event => {
              reset();
              props.onCancel();
            }
          }>Cancel</Button>
          <Button confirm onClick={event => props.onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}