import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {firebaseAuth} from "../../firebase/firebase-config";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import LightDarkToggle from "../../components/LightDarkToggle/LightDarkToggle";
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// @ts-ignore
const RegisterLogin = ({onAuthStateChanged}): JSX.Element => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ register, setRegister ] = useState(false);
    const [ error, setError ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // @ts-ignore
        return onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) navigate("/");
            else {
                try {
                    localStorage.clear();
                } catch (e) {
                    console.log("Problems with local storage", e);
                }
            }
        });
    }, [navigate, onAuthStateChanged]);

    // @ts-ignore
    function handleError(err) {
        if (err.code === 'auth/email-already-in-use') {
            setError("Email already in use. Please log in.");
        } else if (err.code === 'auth/invalid-email') {
            setError("Invalid email address.");
        } else if (err.code === 'auth/user-not-found') {
            setError("User not found. Please register.");
        } else if (err.code === 'auth/wrong-password') {
            setError("Incorrect password.");
        } else if (err.code === "auth/user-disabled") {
            setError("User disabled. Please contact Miklos Mayer on mmayer@dundee.ac.uk");
        } else if (err.code === "auth/weak-password") {
            setError("Password must be at least 6 characters.");
        } else {
            setError("Unknown error. Please contact Miklos Mayer if the error persists on mmayer@dundee.ac.uk");
        }
    }

    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password)
        } catch (err) {
            handleError(err);
        }
    };
    const handleRegister = async () => {
        try {
           await createUserWithEmailAndPassword(firebaseAuth, email, password)
        } catch (err) {
            handleError(err);
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (register) await handleRegister();
        else await handleLogIn();
    };

    const title: string = register ? "Register a new account" : "Log in to your account";
    const errorMessage = error && <Typography data-testid="error-message" variant="body2" color="danger">{error}</Typography>;
    const submitButtonLabel: string = register ? "Register" : "Log in";
    const toggleLabel: string = register ? "Already have an account? " : "Don't have an account? ";
    const toggleLinkLabel: string = register ? "Log in" : "Register";

    return (
        <Paper
            variant="outlined"
            sx={{
                width: 330,
                mx: 'auto', // margin left & right
                my: 4, // margin top & botom
                py: 3, // padding top & bottom
                px: 3, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
        >
            <LightDarkToggle />
            <Typography variant="h3" component="h1">
                Welcome!
            </Typography>
            <Typography variant="h5">
                {title}
            </Typography>
            {errorMessage}
            <form onSubmit={handleSubmit} id={register ? 'register' : 'login'}>
                <Stack direction="column" spacing={2}>
                    <FormControl>
                        <TextField
                            name="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.currentTarget.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            name="password"
                            type="password"
                            label="Password"
                            value={password}
                            onChange={e => setPassword(e.currentTarget.value)}
                        />
                    </FormControl>
                    <Button
                        data-testid={register ? 'register' : 'login'}
                        type="submit"
                        sx={{mt: 1}}
                        variant="contained"
                    >
                        {submitButtonLabel}
                    </Button>
                </Stack>
            </form>
            <Typography variant="body1">
                {toggleLabel}
                <Link
                    data-testid="toggle-login"
                    onClick={() => setRegister(!register)}
                    component='button'
                >
                    {toggleLinkLabel}
                </Link>
            </Typography>
        </Paper>
    );

};

export default RegisterLogin;
