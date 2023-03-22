import React, {useEffect} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth, firebaseFunctions} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Typography} from "@mui/joy";
import {helloWorld} from "../../firebase/backendFunctions";
import { connectFunctionsEmulator } from 'firebase/functions';

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState<string>("Loading...");

    useEffect(() => {
        if(process.env.NODE_ENV === "development") {
            connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
        }
    }, []);

    useEffect(() => {
        const getMessage = async () => {
            try {
                const {data: {message}} = await helloWorld();
                setMessage(message);
            } catch (e) {
                // @ts-ignore
                setMessage(e.message);
            }
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
            <Typography level="h1">Creator</Typography>
            <Typography level="body1">{message}</Typography>
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
        </Stack>
    );
}

export default Creator;
