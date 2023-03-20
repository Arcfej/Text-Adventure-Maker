import { httpsCallable } from "firebase/functions";
import {firebaseFunctions} from "./firebase-config";

export const helloWorld = httpsCallable<unknown, string>(firebaseFunctions, "helloWorld");
