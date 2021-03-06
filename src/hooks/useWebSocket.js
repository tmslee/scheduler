import {useEffect} from "react";

import "index.scss";

const useWebSocket = function (dispatch) {
  useEffect(() => {
    const connection = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    connection.onmessage = (event) => {
      const {type, id, interview} = JSON.parse(event.data);
      if (type === "SET_INTERVIEW") {
        dispatch({type:"SET_INTERVIEW", value:{id, interview}});
      }
    }
    return () => {connection.close()};
  }
  , [dispatch]);
}

export default useWebSocket;