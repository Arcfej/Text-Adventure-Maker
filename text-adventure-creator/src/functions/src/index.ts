import * as functions from "firebase-functions";

export const helloWorld = functions
  .region(functions.config().env.region)
  .https.onCall(() => {
    return {message: "Hello from Firebase!"};
  });
