import React, {useEffect, useState} from "react";
import "./Wordle.css";
import {useDictionary} from "../hooks/useDictionary.ts";
import Tile from "../components/Tile/Tile.tsx";
import useKeypresses from "../hooks/useKeypresses.ts";

interface WordleProps {

}

const Wordle = (props: WordleProps) => {
    const TAG = "[Wordle.tsx]";
    const {getWord, doesWordExist} = useDictionary();
    const [word, setWord] = useState<string>("");
    const [tries, setTries] = useState<string[]>(Array(6).fill("     "));
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");


    useKeypresses([..."qwertyuiopasdfghjklzxcvbnm".split(""), "Enter", "Backspace"], (e) => {
        // useKeypresses("qwertyuiopasdfghjklzxcvbnm".split(""),  () => {
        //     console.log("yayayaya".padEnd(5, " "));
        console.log(e.key, Date.now());
        console.log(TAG, "curr position: ", currentPosition);
        let newGuess = currentGuess.trimEnd();
        switch (e.key) {
            case "Enter":
                if (doesWordExist(newGuess)) {//todo: and check for valid AND score it:3
                    console.log("yeah that word is valid!");
                    setCurrentPosition((curPos) => {
                        return curPos + 1;
                    });
                    // setCurrentGuess(() => "");
                    // newGuess = "";
                    // drawRow(newGuess, "a");
                } else {
                    console.log("not a valid word");
                }
                break;
            case "Backspace":
                newGuess = newGuess.slice(0, newGuess.length - 1);
                newGuess = newGuess.padEnd(5, " ");
                break;
            default:
                console.log(TAG, "default called", newGuess.length);
                if (newGuess.length < 5) {
                    newGuess = (newGuess + e.key).padEnd(5, " ");
                    console.log(TAG, "adding to new guess:", newGuess);
                }
                break;
        }

        setCurrentGuess(newGuess);
        setTries((curTries) => {
            console.log(TAG, "from tries, curPos:", currentPosition, newGuess);
            curTries[currentPosition] = newGuess;
            console.log(TAG, "curtries", curTries);
            return curTries;
        });
    });


    useEffect(() => {
        const wordPicked = getWord();
        setWord(wordPicked);
        console.log(TAG, "wordPicked", wordPicked);
        const newTries = [...tries];
        // newTries[2] = "hello";
        setTries(newTries);
    }, []);

    const drawRow = (guess: string, key: any) => {
        const lettersMap = new Map();//todo: make a more efficient map system where we don't have to make the map for each row... but im lazy rn...

        word?.split("").forEach((letter) => {
            console.log(TAG, letter);
            const val = lettersMap.get(letter);
            lettersMap.set(letter, val ? val + 1 : 1);
        });
        console.log(lettersMap);

        console.log("drawing row");
        return (
            <div className="row" key={key}>
                {guess?.split("").map((letter, index) => {
                    let highLightType: "hit" | "miss" | "inWord";
                    if (letter === " ") {//todo: this logic should only happen on enter >.<
                        highLightType = "miss";
                    } else {


                        const val = lettersMap.get(letter);
                        if (val !== undefined) {
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

    const Board = (
        <div className="board">
            {tries.map((guess, index) => {
                return drawRow(guess, index);
            })}
        </div>
    );


    return (
        <div className="wordle">
            {/*{word?.split("").map( (letter, index) => {*/}
            {/*    return <Tile letter={letter} key={index}/>*/}
            {/*})}*/}
            {Board}
        </div>
    );
};

export default Wordle;
