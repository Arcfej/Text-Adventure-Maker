import React, {useEffect} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth, firebaseFunctions} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Typography} from "@mui/joy";
import {helloWorld} from "../../firebase/backendFunctions";
import { connectFunctionsEmulator } from 'firebase/functions';

function Creator(): JSX.Element {
    const navigate = useNavigate();
    const [message, setMessage] = React.useState<string>("");

    if (process.env.NODE_ENV === "development") {
        connectFunctionsEmulator(firebaseFunctions, "localhost", 5001);
    }

    useEffect(() => {
        const getMessage = async () => {
            const {data: message} = await helloWorld();
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
