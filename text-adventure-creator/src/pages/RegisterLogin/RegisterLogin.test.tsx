import React from 'react';
import {render, screen, fireEvent, cleanup, waitFor} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import RegisterLogin from './RegisterLogin';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {firebaseAuth} from "../../firebase/firebase-config";
import {Auth, User} from "firebase/auth";
// import * as auth from "firebase/auth";

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
}));

let currentUser: User | null = null;
const mockOnAuthStateChanged = jest.fn().mockImplementation((auth, callback) => {
    callback(currentUser);
});

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockedNavigate,
}));

describe('RegisterLogin', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(cleanup);

    it('renders Log in by default', () => {
        render(
            <BrowserRouter>
                <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged} />
            </BrowserRouter>
        );

        expect(screen.getByText('Log in to your account')).toBeInTheDocument();
        expect(screen.queryByText('Already have an account?')).not.toBeInTheDocument();
    });

    it('toggles between Log in and Register', () => {
        render(
            <BrowserRouter>
                <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged} />
            </BrowserRouter>
        );

        const toggleButton = screen.getByTestId('toggle-login');

        fireEvent.click(toggleButton);

        expect(screen.getByText('Already have an account?')).toBeInTheDocument();
        expect(screen.queryByText('Log in to your account')).not.toBeInTheDocument();

        fireEvent.click(toggleButton);

        expect(screen.getByText('Log in to your account')).toBeInTheDocument();
        expect(screen.queryByText('Already have an account?')).not.toBeInTheDocument();
    });

    it('login calls signInWithEmailAndPassword', async () => {
        render(
            <BrowserRouter>
                <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged}/>
            </BrowserRouter>
        );

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByTestId('login');

        fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
        fireEvent.change(passwordInput, {target: {value: 'testpassword'}});
        fireEvent.click(loginButton);

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            firebaseAuth,
            'test@example.com',
            'testpassword'
        );
    });

    it('should redirect to the creator page when a user is logged in', async () => {
        jest.restoreAllMocks();
        const currentUser = { uid: 'test-uid' } as User;

        jest.mock('firebase/auth', () => ({
            getAuth: jest.fn().mockReturnValue({
                    currentUser: currentUser,
                } as Auth
            ),
        }));

        const onAuthStateChanged = jest.fn().mockImplementation((auth, callback) => {
                callback(currentUser);
        });

        render(
            <BrowserRouter>
                <RegisterLogin onAuthStateChanged={onAuthStateChanged}/>
            </BrowserRouter>
        );

        await waitFor(() => expect(onAuthStateChanged).toHaveBeenCalled());
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/'));
    });

    // it('should display an error message when login fails', async () => {
    //     const error = { code: 'unknown code', message: 'Test error' };
    //     jest.spyOn(auth, 'signInWithEmailAndPassword').mockRejectedValue(error);
    //
    //     render(
    //         <BrowserRouter>
    //             <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged} />
    //         </BrowserRouter>
    //     );
    //
    //     const emailInput = screen.getByPlaceholderText('Email');
    //     const passwordInput = screen.getByPlaceholderText('Password');
    //     const loginButton = screen.getByTestId('login');
    //
    //     fireEvent.change(emailInput, { target: { value: 'wrong@email.address' } });
    //     fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    //     fireEvent.click(loginButton);
    //
    //     await screen.findByText('Unknown error. Please contact Miklos Mayer if the error persists on mmayer@dundee.ac.uk');
    // });

    it('calls createUserWithEmailAndPassword when Register is clicked', async () => {
        render(
            <BrowserRouter>
                <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('toggle-login'));

        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const registerButton = screen.getByTestId('register');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        fireEvent.click(registerButton);

        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
            firebaseAuth,
            'test@example.com',
            'testpassword'
        );
    });

    // it('should display an error message when email is invalid for registration', async () => {
    //     jest.restoreAllMocks();
    //     const error = { code: 'unknown code', message: 'Test error' };
    //     jest.spyOn(auth, 'createUserWithEmailAndPassword').mockRejectedValue(error);
    //
    //     render(
    //         <BrowserRouter>
    //             <RegisterLogin onAuthStateChanged={mockOnAuthStateChanged} />
    //         </BrowserRouter>
    //     );
    //
    //     fireEvent.click(screen.getByTestId('toggle-login'));
    //
    //     const emailInput = screen.getByPlaceholderText('Email');
    //     const passwordInput = screen.getByPlaceholderText('Password');
    //     const registerButton = screen.getByTestId('register');
    //
    //     fireEvent.change(emailInput, { target: { value: 'wrong@email.address' } });
    //     fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    //     fireEvent.click(registerButton);
    //
    //     await screen.findByText('Unknown error. Please contact Miklos Mayer if the error persists on mmayer@dundee.ac.uk');
    // });
});
