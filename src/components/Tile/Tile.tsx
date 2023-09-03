import React from "react";
import "./Tile.css";

interface TileProps {
    letter?: string;
    // hit?: boolean;//for if the letter is in the right position
    // miss?: boolean;//for if the letter is not in the word
    // inWord?: boolean;//for if the letter is in the word but wrong position
    highlight: "hit"|"miss"|"inWord"
}

// type TileProps = {
//     letter?: string;
// } & ({
//     hit: boolean;
// } | {
//     miss: boolean;
// } | {
//     inWord: boolean;
// });

const Tile = (props: TileProps) =>{
    const TAG = "[Tile.tsx]";
    const shouldHighlight = props.letter !== undefined && props.letter !== " ";

    return (
        <div className={`tile ${shouldHighlight && "hasLetter"} ${props.highlight}`.trimEnd()}>
            {props.letter}
        </div>
    );
}

export default Tile;
