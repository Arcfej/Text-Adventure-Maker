import React, {useEffect} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";
import {Button, Stack, Typography} from "@mui/joy";

function Creator(): JSX.Element {
    const navigate = useNavigate();

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
            <Typography level="body1">Logged in</Typography>
            <Button onClick={() => firebaseAuth.signOut()}>Log out</Button>
        </Stack>
    );
}

export default Creator;
