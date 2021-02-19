const getAppointmentsForDay = function (state, day) {
  let apptIds = [];
  
  for(let dayItem of state.days){
    if (dayItem.name === day) {
      apptIds = [...apptIds, ...dayItem.appointments];
    }
  }

  let filteredAppts = [];
  for (const apptId of apptIds){
    filteredAppts.push(state.appointments[apptId]);
  }
  return filteredAppts;
};

const getInterview = function (state, interview) {
  if (!interview) return null;

  const interviewerId = interview.interviewer;
  return {...interview, interviewer:state.interviewers[interviewerId]};
};

const getInterviewersForDay = function (state, day) {
  let interviewerIds = [];
  
  for(let dayItem of state.days){
    if (dayItem.name === day) {
      interviewerIds = [...interviewerIds, ...dayItem.interviewers];
    }
  }

  let filteredInterviewers = [];
  for (const interviewerId of interviewerIds){
    filteredInterviewers.push(state.interviewers[interviewerId]);
  }
  return filteredInterviewers;
};

export {getAppointmentsForDay, getInterview, getInterviewersForDay}; 