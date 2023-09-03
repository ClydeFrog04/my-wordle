//example from:https://github.com/jacobbuck/react-use-keypress/blob/main/src/index.js
//example modified to typescript
//https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

import React, {useEffect, useRef} from "react";

const useKeypresses =  (keys:(string|string[]), handler: ((e: any)=>any)|null) => {

    const eventListenerRef = useRef<(event: React.KeyboardEvent) => void>();

    useEffect(() => {
        eventListenerRef.current =  (event: React.KeyboardEvent) => {
            if(keys.includes(event.key) || keys === event.key){
                handler?.(event);
            }
        }
    }, [keys, handler]);

    useEffect(() => {
        const eventListener = (event: any) => {
            if(eventListenerRef.current){
                eventListenerRef.current(event);
            }
        }
        window.addEventListener("keydown", eventListener);
        return  () => {
            window.removeEventListener("keydown", eventListener);
        }
    }, []);
}

export default useKeypresses;
