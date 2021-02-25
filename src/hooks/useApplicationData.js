import {useReducer, useEffect} from "react";
import axios from "axios";
import useWebSocket from "./useWebSocket";
import reducer, { 
  SET_DAY,
  SET_DAYS,
  SET_APPOINTMENTS,
  SET_INTERVIEW,
  SET_INTERVIEWERS,
  SET_APPLICATION_DATA
} from "reducers/application";

// axios.defaults.baseURL = "http://localhost:8001/";

const useApplicationData = function() {
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`)
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
    return axios.put(`/api/appointments/${id}`, {...appointment})
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
    return axios.delete(`/api/appointments/${id}`)
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