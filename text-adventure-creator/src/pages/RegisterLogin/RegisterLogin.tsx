import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router";
import {firebaseAuth} from "../../firebase/firebase-config";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";

// @ts-ignore
const RegisterLogin = ({onAuthStateChanged}): JSX.Element => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ register, setRegister ] = useState(false);
    const [ error, setError ] = useState('');

    const navigate = useNavigate();

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

    useEffect(() => {
        // @ts-ignore
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) navigate("/");
        });
    }, [navigate, onAuthStateChanged]);

    const title: string = register ? "Register" : "Log in to your account";
    const toggleLabel: string = register ? "Already have an account? " : "Don't have an account? ";
    const errorMessage = error ? <p data-testid="error-message">{error}</p> : '';
    const toggleButtonLabel: string = register ? "Log in" : "Register";
    const submitButtonLabel: string = register ? "Register" : "Log in";
    const submit: () => void = register ? handleRegister : handleLogIn;

    return (
    <div>
        <h1>{title}</h1>
        <p>
            {toggleLabel}
            <button data-testid="toggle-login" onClick={() => setRegister(!register)}>
                {toggleButtonLabel}
            </button>
        </p>
        {errorMessage}
        <input type={'text'} placeholder={'Email'} value={email} onChange={e => setEmail(e.currentTarget.value)} />
        <input type={'password'} placeholder={'Password'} value={password} onChange={e => setPassword(e.currentTarget.value)} />
        <button data-testid={register ? 'register' : 'login'} onClick={submit}>{submitButtonLabel}</button>
    </div>
    );

};

export default RegisterLogin;
