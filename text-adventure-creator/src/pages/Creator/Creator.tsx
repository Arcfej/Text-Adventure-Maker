import React, {useEffect, useState} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/joy";

interface Game {
    intro: string;
    owner: string;
    _id: string;
}

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [games, setGames] = useState<Game[]>([]);
    const [count, setCount] = useState(0);
    const [token, setToken] = useState("");

    const fetchGames = async () =>
        fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => response.json())
            .then(data => {
                if (!data.error) setGames(data)
                else console.log(data.error);
            });

    const insertGame = async () => {
        return fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    game: count,
                }),
            })
            .then(response => response.json())
            .then(() => setCount(count + 1))
            .then(fetchGames);
    };

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, async (currentUser) => {
            if (!currentUser) navigate("/login");
            else {
                setToken(await currentUser.getIdToken(true));
                fetchGames();
            }
        });
    }, []);

    return (
        <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
        >
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
            <Button onClick={fetchGames}>List / update games</Button>
            <Button onClick={insertGame}>Insert game</Button>
            {games && games.map((game, index) => (
                <div key={index}>{game.intro}</div>
            ))}
        </Stack>
    );
}

export default Creator;
