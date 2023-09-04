import React, {JSX, useEffect, useState} from "react";
import "./Wordle.css";
import {useDictionary} from "../hooks/useDictionary.ts";
import Tile from "../components/Tile/Tile.tsx";
import useKeypresses from "../hooks/useKeypresses.ts";
import {ToastContainer, toast, Slide, Zoom} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface WordleProps {

}

export const Wordle = (props: WordleProps) => {
    const TAG = "[Wordle.tsx]";
    const maxRows = 6;
    const maxWordLength = 5;
    const {getWord, doesWordExist} = useDictionary();
    const [word, setWord] = useState<string>("");
    const [tries, setTries] = useState<string[]>(Array(maxRows).fill("     "));
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");
    const [rows, setRows] = useState<JSX.Element[]>();

    //a game can be both not won and not lost, conditions for win are we are not exceeded max rows, and guess === word
    const [isGameWon, setIsGameWon] = useState(false);
    //condition for lost are we are at max rows and guess !== word
    const [isGameLost, setIsGameLost] = useState(false);



    useKeypresses([..."qwertyuiopasdfghjklzxcvbnm".split(""), "Enter", "Backspace"], (e) => {
        if(!canPlay()) return;
        // useKeypresses("qwertyuiopasdfghjklzxcvbnm".split(""),  () => {
        //     console.log("yayayaya".padEnd(maxWordLength, " "));
        console.log(TAG, "curr position: ", currentPosition);
        let newGuess = currentGuess.trimEnd();
        let newPosition = currentPosition;
        switch (e.key) {
            case "Enter":
                if (doesWordExist(newGuess)) {//todo: and check for valid AND score it:3 score it BEFORE resetting state
                    console.log("yeah that word is valid!");
                    if (rows) {
                        console.log(TAG, "row found was:", rows[currentPosition]);
                        if(newGuess === word){
                            console.log(TAG, "you win!");
                            toast("You won!", {
                                toastId: "youWin"
                            });
                            setIsGameWon(true);
                        }
                        // const newRows = [...rows];
                        // newRows[currentPosition] = drawRow(newGuess, 'x', true);
                        // setRows(newRows);
                    }
                    setCurrentPosition((curPos) => {
                        newPosition = curPos + 1;
                        if(newPosition > maxRows - 1){//- 1 since newPosition tracks array value and arrays are zero based
                            toast(`You lost! The word was ${word}`, {
                                toastId: "youLost"
                            });
                            setIsGameLost(true);
                        }
                        return newPosition;
                    });
                    setCurrentGuess(() => "");
                    newGuess = "";
                    // drawRow(newGuess, "a");
                } else {
                    console.log("not a valid word");
                    // toast.clearWaitingQueue();
                    // toast.dismiss();
                    if(newGuess.length < maxWordLength){
                        toast("Word is too short!", {
                            toastId: "wordTooShort"
                        });
                    } else {
                        toast("Word does not exist!", {
                            toastId: "doesNotExist"
                        });
                    }

                }
                break;
            case "Backspace":
                    newGuess = newGuess.slice(0, newGuess.length - 1);
                    newGuess = newGuess.padEnd(maxWordLength, " ");
                    setNewGuess(newGuess);
                break;
            default:
                // console.log(TAG, "default called", newGuess.length);
                if (newGuess.length < maxWordLength) {
                    newGuess = (newGuess + e.key).padEnd(maxWordLength, " ");
                    console.log(TAG, "adding to new guess:", newGuess);
                    setNewGuess(newGuess);
                }
                break;
        }
    });

    const canPlay =  () => {
        return (!isGameLost && !isGameWon);
    }
    const setNewGuess = (newGuess: string) => {
        setCurrentGuess(newGuess);
        setTries((curTries) => {
            console.log(TAG, "from tries, curPos:", currentPosition, newGuess);
            curTries[currentPosition] = newGuess;
            console.log(TAG, "curtries", curTries);
            return curTries;
        });
    }


    useEffect(() => {
        const wordPicked = getWord();
        setWord(wordPicked);
        console.log(TAG, "wordPicked", wordPicked);
        const newTries = [...tries];
        // newTries[2] = "hello";
        setTries(newTries);
    }, []);

    useEffect(() => {
        if(isGameLost){
            console.log(TAG, "you lost!");
        }
    }, [isGameLost]);

    /**
     *
     * @param guess the guess for this row
     * @param key the key needed by react for mapped items
     * @param scoreRow a boolean for if we should score the row yet or not, scoreRow only on enter, todo: or maybe also when curPos < index/key?
     */
    const drawRow = (guess: string, key: any, scoreRow: boolean) => {
        const lettersMap = new Map();//todo: make a more efficient map system where we don't have to make the map for each row... but im lazy rn...

        word?.split("").forEach((letter) => {
            // console.log(TAG, letter);
            const val = lettersMap.get(letter);
            lettersMap.set(letter, val ? val + 1 : 1);
        });
        console.log(lettersMap);

        // console.log("drawing row");
        return (
            <div className="row" key={key}>
                {guess?.split("").map((letter, index) => {
                    let highLightType: "hit" | "miss" | "inWord";
                    if (letter === " " || !scoreRow) {//todo: this logic should only happen on enter >.<
                        highLightType = "miss";
                    } else {

                        const val = lettersMap.get(letter);
                        console.log("letter val found: ", val);
                        if (val !== undefined && val !== 0) {
                            if (word[index] === letter) {
                                highLightType = "hit";
                            } else {
                                highLightType = "inWord";
                            }
                            lettersMap.set(letter, val - 1);
                        } else {
                            highLightType = "miss";
                        }
                    }
                    return <Tile highlight={highLightType} letter={letter} key={index}/>;
                })}
            </div>
        );
    };

    useEffect(() => {
        console.log(TAG, "tries from useeffect", JSON.stringify(tries));
        const triesMap = tries.map((guess, index) => {
            return drawRow(guess, index, index < currentPosition);//index < currPos scores all previous guesses :]
        });

        setRows(() => triesMap);
    }, [currentGuess]);


    function Board() {

        return (
            <div className="board">
                {rows?.map( (e) => {
                    return e;
                })}
            </div>
        );
    }

    function resetGame() {
        console.log(TAG, "resetting game", currentGuess);
        const wordPicked = getWord();
        setWord(wordPicked);
        console.log(TAG, "wordPicked", wordPicked);
        const newTries = Array(maxRows).fill("     ");
        // newTries[2] = "hello";
        setTries(newTries);
        setCurrentGuess("");
        setCurrentPosition(0);
        setIsGameWon(false);
        setIsGameLost(false);

        const triesMap = newTries.map((guess, index) => {
            return drawRow(guess, index, index < currentPosition);//index < currPos scores all previous guesses :]
        });

        setRows(() => triesMap);
    }


    return (
        <div className="wordle">
            <ToastContainer position={"top-center"} autoClose={1000} hideProgressBar transition={Zoom} limit={1}/>
            {/*{word?.split("").map( (letter, index) => {*/}
            {/*    return <Tile letter={letter} key={index}/>*/}
            {/*})}*/}
            {Board()}
            {!canPlay() &&
                <>
                    <div>{isGameWon ? "you win!" : "you lost!"}</div>
                    <button onClick={resetGame}>Play again!</button>
                </>
            }
        </div>
    );
};

