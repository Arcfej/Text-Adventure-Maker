import React, {useEffect} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack} from "@mui/joy";

function Creator(): JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    // const insertGame = async () =>
    //     fetch("https://backend.text-adventure-maker.workers.dev/games",
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 game: count,
    //             })
    //         })
    //         .then(response => response.json())
    //         .then(() => setCount(count + 1))
    //         .then(fetchGames);

    return (
        <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
        >
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
        </Stack>
    );
}

export default Creator;
