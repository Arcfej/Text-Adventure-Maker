import * as functions from "firebase-functions";

export const helloWorld = functions
  .region(`${process.env.region}`)
  .https.onCall(() => {
    console.log(functions.config().evn.region);
    return "Hello from Firebase!";
  });
