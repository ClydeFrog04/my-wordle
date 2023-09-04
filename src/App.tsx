import "./App.scss";
import {Route, Routes} from "react-router-dom";
import {useEffect} from "react";
import {useDictionary} from "./hooks/useDictionary.ts";
import {Wordle} from "./pages/Wordle.tsx";

function App() {
    const TAG = "[App.tsx]";

    useEffect(() => {
        // getWord("four").then( (res) => {
        //     console.log(res.data);
        // }).catch( (e) => {
        //     console.error(e);
        // });
        //
        // getWord("fourr").then( (res) => {
        //     console.log(res.data);
        // }).catch( (e) => {
        //     console.error(e.response.status);
        //     console.error(e.response.data.message);
        // });
        // const response = getWord("four");
        // console.log(TAG, response);
    }, []);

    return (
        <>
            <div className="App">
                <Routes>
                    <Route
                        path={"/"}
                        element={
                            <Wordle/>
                        }
                    />
                </Routes>
            </div>
        </>
    );
}

export default App;
