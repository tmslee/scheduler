import React, {useState, useEffect} from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import {useVisualMode} from "hooks/useVisualMode";

const classNames = require('classnames');

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const REMOVE = "REMOVE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_MISSING_FIELDS = "ERROR_MISSING_FIELDS";

export default function Appointment(props) {
  const appointmentClass = classNames(
    "appointment",
    {
      "appointment:last-of-type" : props.id === "last"
    }
  );

  const {
    id, 
    time, 
    interview, 
    interviewers, 
    bookInterview, 
    removeInterview
  } = props;

  const {mode, transition, back} = useVisualMode(interview ? SHOW : EMPTY);

  useEffect(() => {
    if (!props.interview && mode === SHOW) transition(EMPTY);
    if (props.interview && mode === EMPTY) transition(SHOW);
  }, [props.interview, transition, mode])

  const save = function (name, interviewer) {
    const interview = {
      student:name,
      interviewer
    }
    if (!interviewer || !name) transition(ERROR_MISSING_FIELDS);
    else {
      transition(SAVING);
      bookInterview(id, interview)
      .then(res => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
    }
  }

  const remove = function (id) {
    transition(REMOVE, true);
    removeInterview(id)
    .then(res => transition(EMPTY))
    .catch(err => transition(ERROR_DELETE, true));
  }

  const edit = function () {
    transition(EDIT);
  }

  const confirm = function () {
    transition(CONFIRM);
  }

  return (
    <article className={appointmentClass}>
      <Header
        time={time}
      />
      {mode === EMPTY && !interview &&
        <Empty onAdd={() => transition(CREATE)}/>
      }
      {mode === SHOW && interview &&
        <Show
          id={id}
          student={interview.student}
          interviewer={interview.interviewer}  
          onDelete={confirm}
          onEdit={edit}
        />
      }
      {mode === CREATE &&
        <Form
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      }
      {mode === EDIT &&
        <Form
          id={id}
          name={interview.student}
          interviewer={interview.interviewer.id}  
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      }
      {mode === SAVING &&
        <Status message={"Saving"}/>
      }
      {mode === REMOVE &&
        <Status message={"Deleting"}/>
      }
      {mode === CONFIRM &&
        <Confirm
          id={id}
          message={'Are you sure you want to delete this appointment?'}
          onCancel={back}
          onConfirm={remove}
        />
      }
      {mode === ERROR_SAVE &&
        <Error
          message={`Error during saving, please try again`}
          onClose={back}
        />
      }
      {mode === ERROR_DELETE &&
      <Error
        message={`Error during deleting, please try again`}
        onClose={back}
      />
      }
      {mode === ERROR_MISSING_FIELDS &&
      <Error
        message={`Missing fields: please fill in the form before submitting`}
        onClose={back}
      />
      }
    </article>
  );
}
