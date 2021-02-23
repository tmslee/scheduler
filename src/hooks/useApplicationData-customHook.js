import {useState, useEffect} from "react";
import axios from "axios";
// import axios from "__mock__/axios";

const useApplicationData = function() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState(prev => ({...prev, day}));


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
      setState(prev => ({...prev, days, appointments, interviewers}));
    });
  }, []);
  
  useEffect(() => {
    const connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    connection.onopen = () => {
      connection.send("ping");

      connection.onmessage = (event) => {
        console.log(`Message Received: ${event.data}`);
      }
      
    }
  }
  , [])
  
  const updateDay = function (num, dayName, isDelete, isNew) {
    const days = state.days;
    const currDay = days.filter(day => day.name === dayName)[0];

    let newDay = {...currDay};
    if (isDelete || isNew) {
      newDay = {...currDay, spots:currDay.spots+num};
    } 

    days[currDay.id-1] = newDay;
    setState(prev => ({...prev, days}));
  }

  const bookInterview = function (id, interview) {
    let isNew;
    const prevAppt = state.appointments[id];
    isNew = prevAppt.interview == null;
    console.log(isNew);

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
      setState(prev => ({...prev, appointments}));
      console.log(isNew);
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
      setState(prev => ({...prev, appointments}))
      updateDay(1,state.day, true);
    })
  }

  return {
    state,
    setDay,
    bookInterview,
    removeInterview
  }
}

export default useApplicationData;