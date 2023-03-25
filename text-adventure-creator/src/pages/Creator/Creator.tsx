import React, {useEffect, useState} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Typography} from "@mui/joy";

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [games, setGames] = useState<Array<{key: string, value: string}>>([]);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    useEffect(() => {
        const fetchGames = async () => {
            const response = fetch("http://localhost:8787/games", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => console.log(data));
        };
        try {
            fetchGames();
        } catch (e) {
            console.error(e);
        }
    })

    return (
        <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
        >
            <Typography level="body1">Logged in</Typography>
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
        </Stack>
    );
}

export default Creator;
