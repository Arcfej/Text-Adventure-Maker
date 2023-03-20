import React, {useEffect, useState} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth, firebaseFunctions} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Typography} from "@mui/joy";
import {connectFunctionsEmulator} from "firebase/functions";
import {helloWorld} from "../../firebase/firebaseBackend";

function Creator(): JSX.Element {
    const [message, setMessage] = useState('Loading...');
    const navigate = useNavigate();

    if (process.env.NODE_ENV === "development") {
        connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
    }

    useEffect(() => {
        const getMessage = async () => {
            const result = await helloWorld();
            console.log(result);
            const message = result.data;
            setMessage(message);
        };
        getMessage();
    }, []);

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    return (
        <Stack
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
        >
            <Typography level="body1">{message}</Typography>
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
        </Stack>
    );
}

export default Creator;
