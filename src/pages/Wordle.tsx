import React, {useEffect, useState} from "react";
import "./Wordle.css";
import {useDictionary} from "../hooks/useDictionary.ts";
import Tile from "../components/Tile/Tile.tsx";
import useKeypresses from "../hooks/useKeypresses.ts";

interface WordleProps {

}

const Wordle = (props: WordleProps) =>{
    const TAG = "[Wordle.tsx]";
    const {getWord} = useDictionary();
    const [word, setWord] = useState<string|undefined>(undefined);
    const [tries, setTries] = useState<string[]>(Array(6).fill("     "));
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentGuess, setCurrentGuess] = useState("");


    useKeypresses([..."qwertyuiopasdfghjklzxcvbnm".split(""), "Enter", "Backspace"],  (e) => {
    // useKeypresses("qwertyuiopasdfghjklzxcvbnm".split(""),  () => {
    //     console.log("yayayaya".padEnd(5, " "));
        console.log(e.key, Date.now());
        let newGuess = currentGuess.trimEnd();
        switch (e.key){
            case "Enter":
                break;
            case "Backspace":
                newGuess = newGuess.slice(0, newGuess.length - 1);
                newGuess = newGuess.padEnd(5, " ");
                break;
            default:
                console.log(TAG, "default called", newGuess.length);
                if(newGuess.length < 5){
                    newGuess = (newGuess + e.key).padEnd(5, " ");
                    console.log(TAG, "adding to new guess:", newGuess);
                }
                break;
        }

        setCurrentGuess(newGuess);
        setTries( (curTries) => {
            curTries[currentPosition] = newGuess;
            return curTries;
        });
    });



    useEffect(() => {
        setWord(getWord);
    }, []);

    const drawRow = (word: string, key: any) => {

        return (
            <div className="row" key={key}>
                {word?.split("").map( (letter, index) => {
                    return <Tile letter={letter} key={index}/>
                })}
            </div>
        )
    }

    const Board = (
        <div className="board">
            {tries.map( (word, index) => {
                return drawRow(word, index);
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
}

export default Wordle;
