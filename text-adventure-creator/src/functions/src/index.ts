import * as functions from "firebase-functions";

export const helloWorld = functions
  .region(`${process.env.region}`)
  .https.onCall(() => {
    console.log(process.env.region);
    return {message: "Hello from Firebase!"};
  });
