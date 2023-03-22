import { httpsCallable } from "firebase/functions";
import {firebaseFunctions} from "./firebase-config";

interface IHelloWorld {
    message: string;
}

export const helloWorld = httpsCallable<unknown, IHelloWorld>(firebaseFunctions, "helloWorld");
