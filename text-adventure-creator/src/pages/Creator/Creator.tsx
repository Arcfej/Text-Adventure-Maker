import React, {useEffect} from 'react';
import { onAuthStateChanged } from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {useNavigate} from "react-router-dom";

function Creator(): JSX.Element {
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (!currentUser) navigate("/login");
        });
    }, [navigate]);

    return (
        <div>
            <div>Logged in</div>
            <button onClick={() => firebaseAuth.signOut()}>Log out</button>
        </div>
    );
}

export default Creator;
