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

    case SET_INTERVIEW: //this dispatch for webSocket rendering
      const id = action.value.id
      const newInterview = action.value.interview;
      
      const apptDay = state.days[Math.ceil(id/5)-1];
      
      let dayBuffer = {...apptDay, spots:apptDay.spots};
      const apptBuffer = {...state.appointments[id]};

      if(newInterview === null) { //deleting: add spot
        dayBuffer = {...apptDay, spots:apptDay.spots+1};
      } else if (!apptBuffer.interview) { //adding: remove spot
        dayBuffer = {...apptDay, spots:apptDay.spots-1};
      }

      //update daysBuffer
      const daysBuffer = [...state.days];
      daysBuffer[dayBuffer.id-1] = dayBuffer;

      //update apptBuffer
      apptBuffer.interview = newInterview;
      const apptsBuffer = {...state.appointments, [id]:apptBuffer};
      
      //return updated state
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

export default reducer;
export {
  SET_DAY,
  SET_DAYS,
  SET_APPOINTMENTS,
  SET_INTERVIEW,
  SET_INTERVIEWERS,
  SET_APPLICATION_DATA
};