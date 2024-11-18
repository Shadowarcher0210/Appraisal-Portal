import React from 'react';

function useAutosave(callback, delay = 1000, deps = []) {
    const savedCallback = React.useRef();

    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    React.useEffect(() => {
        function runCallback() {
            savedCallback.current();
        };
        if (typeof delay === 'number') {
            let interval = setInterval(runCallback, delay);
            return () => clearInterval(interval);
        }
    }, [delay, ...deps]);
};

export default useAutosave;