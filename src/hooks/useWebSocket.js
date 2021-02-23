import {useEffect} from "react";

const useWebSocket = function (dispatch) {
  useEffect(() => {
    const connection = new WebSocket("ws://localhost:8001");
    connection.onmessage = (event) => {
      const {type, id, interview} = JSON.parse(event.data);
      if (type === "SET_INTERVIEW") {
        dispatch({type:"SET_INTERVIEW", value:{id, interview}});
      }
    }
    return () => {connection.close()};
  }
  , []);
}

export default useWebSocket;