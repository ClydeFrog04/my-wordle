import axios from "axios";
import {useEffect, useState} from "react";
import words from "../res/fiveLetterWords.json";

export const useDictionary = () => {
    const TAG = "[useDictionary.ts]";

    const wordsList: string[] = words.words;
    const limit = wordsList.length;

    useEffect(() => {


    }, []);

    const getWord = () => {
        const num = Math.floor(Math.random() * limit);
        return wordsList[num];
    }

    return {
        getWord
    }
}



/*
import axios from "axios";
import {useEffect, useState} from "react";

export const useDictionary = (word: string) => {
    const dictionary = axios.create({
        baseURL: "https://api.dictionaryapi.dev/api/v2/entries/en/"
    });

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error|null>(null);

    useEffect(() => {
        async function getWord(){
            try{
                setLoading(true);
                setError(null);

                const response = await dictionary.get(word);
                setData(response.data);
            } catch (error: any){
                setError(error);
            } finally {
                setLoading(false)
            }
        }
    }, [word]);

    // const getWord = async (word: string) => {
    //     return dictionary.get(word);
    // }

    return {
        data,
        loading,
        error
    }
}

 */
