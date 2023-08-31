import React from "react";
import "./Tile.css";

interface TileProps {
    letter?: string;
}

const Tile = (props: TileProps) =>{
    const TAG = "[Tile.tsx]";


    return (
        <div className={`tile ${props.letter && "hasLetter"}`.trimEnd()}>
            {props.letter}
        </div>
    );
}

export default Tile;
