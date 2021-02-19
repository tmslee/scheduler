import {useState} from "react";

const useVisualMode = function (initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace=false) {
    setMode(newMode);
    setHistory(prev => {
      if(!replace) {
        return [...prev, newMode];
      } else {
        const buffer = [...prev];
        buffer.pop();
        return [...buffer, newMode];
      }
    });
  }

  const back = function (){
    if (mode !== "FIRST"){
      setHistory(prev => {
        const prevMode = prev[prev.length-2];
        setMode(prevMode);
        const buffer = [...prev];
        buffer.pop();
        return buffer;
      })
    }
  }

  return {
    mode,
    transition,
    back
  };
};

export {useVisualMode};