import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {firebaseAuth} from "../firebase/firebase-config";
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";

const RegisterLogin = (): JSX.Element => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ register, setRegister ] = useState(false);

    const navigate = useNavigate();

    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
        } catch (err) {
            console.log(err);
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) navigate("/");
        });
    }, [navigate]);

    const title: string = register ? "Register" : "Log in to your account";
    const buttonLabel: string = register ? "Register" : "Log in";
    const submit: () => void = register ? handleRegister : handleLogIn;

    return (
    <div>
        <h1>{title}</h1>
        {!register && <p>Don't have an account? <button onClick={() => setRegister(true)}>Register</button></p>}
        {register && <p>Already have an account? <button onClick={() => setRegister(false)}>Log in</button></p>}
        <input type={'text'} placeholder={'Email'} value={email} onChange={e => setEmail(e.currentTarget.value)} />
        <input type={'password'} placeholder={'Password'} value={password} onChange={e => setPassword(e.currentTarget.value)} />
        <button onClick={submit}>{buttonLabel}</button>
    </div>
    );

};

export default RegisterLogin;
