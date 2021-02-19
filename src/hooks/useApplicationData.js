import {useReducer, useEffect} from "react";
import axios from "axios";
import useWebSocket from "./useWebSocket";

const useApplicationData = function() {
  const SET_DAY = "SET_DAY";
  const SET_DAYS = "SET_DAYS";
  const SET_APPOINTMENTS = "SET_APPOINTMENTS";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_INTERVIEWERS = "SET_INTERVIEWERS";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";

  const reducer = function (state, action) {
    switch(action.type) {
      case SET_DAY:
        return {...state, day: action.value};
      case SET_DAYS: 
        return {...state, days: action.value};

      case SET_INTERVIEW:
        const id = action.value.id
        const newInterview = action.value.interview;
        
        const apptDay = state.days[Math.ceil(id/5)-1];
        
        let dayBuffer = {...apptDay, spots:apptDay.spots};
        const apptBuffer = {...state.appointments[id]};

        if(newInterview === null) {
          dayBuffer = {...apptDay, spots:apptDay.spots+1};
        } else if (!apptBuffer.interview) {
          dayBuffer = {...apptDay, spots:apptDay.spots-1};
        }
        const daysBuffer = [...state.days];
        daysBuffer[dayBuffer.id-1] = dayBuffer;

        apptBuffer.interview = newInterview;
        const apptsBuffer = {...state.appointments, [id]:apptBuffer};

        return {...state, appointments:apptsBuffer, days:daysBuffer};

      case SET_APPOINTMENTS:
        return {...state, appointments: action.value};
      case SET_INTERVIEWERS:
        return {...state, interviewers: action.value};
      case SET_APPLICATION_DATA:
        return {
          ...state, 
          days: action.value.days,
          appointments: action.value.appointments,
          interviewers: action.value.interviewers
        };
      default: 
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ])
    .then(output => {
      const days = output[0].data;
      const appointments = output[1].data;
      const interviewers = output[2].data;
      dispatch({type: SET_APPLICATION_DATA, value:{days, appointments, interviewers}});
    });
  }, []);


  const updateDay = function (num, dayName, isDelete, isNew) {
    const days = state.days;
    const currDay = days.filter(day => day.name === dayName)[0];

    let newDay = {...currDay};
    if (isDelete || isNew) {
      newDay = {...currDay, spots:currDay.spots+num};
    } 

    days[currDay.id-1] = newDay;
    dispatch({type: SET_DAYS, value:days});
  }

  const bookInterview = function (id, interview) {
    let isNew;
    const prevAppt = state.appointments[id];
    isNew = prevAppt.interview == null;

    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.put(`http://localhost:8001/api/appointments/${id}`, {...appointment})
    .then(res => {
      dispatch({type: SET_APPOINTMENTS, value: appointments});
      updateDay(-1, state.day, false, isNew);
    });
  }

  const removeInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(res => {
      dispatch({type: SET_APPOINTMENTS, value: appointments});
      updateDay(1, state.day, true);
    })
  }

  useWebSocket(dispatch);

  return {
    state,
    dispatch,
    bookInterview,
    removeInterview
  }
}

export default useApplicationData;