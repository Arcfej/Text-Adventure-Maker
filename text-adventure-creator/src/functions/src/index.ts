import * as functions from "firebase-functions";

export const helloWorld = functions
  .region(functions.config().env.region)
  .https.onCall((data): string => {
    functions.logger.info("Hello logs!", data);
    return "Hello from Functions!";
  });
