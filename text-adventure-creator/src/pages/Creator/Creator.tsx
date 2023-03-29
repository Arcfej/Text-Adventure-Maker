import React, {useEffect, useState} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/joy";

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [games, setGames] = useState<Array<{key: string, value: string}>>([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    const fetchGames = async () =>
        fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => response.json())
            .then(data => setGames(data))
            .then(() => console.log(games));

    useEffect(() => {
        fetchGames();
    }, []);

    const insertGame = async () =>
        fetch("https://backend.text-adventure-maker.workers.dev/games",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    game: count,
                })
            })
            .then(response => response.json())
            .then(() => setCount(count + 1))
            .then(fetchGames);

    return (
        <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
        >
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
            <Button onClick={fetchGames}>List / update games</Button>
            <Button onClick={insertGame}>Insert game</Button>
        </Stack>
    );
}

export default Creator;
