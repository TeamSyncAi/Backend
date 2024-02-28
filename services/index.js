import * as functions from 'firebase-functions';
import cors from 'cors';
import admin from 'firebase-admin';
import bodyParser from 'body-parser'; // Import body-parser for parsing request body
import serviceAccount from './service-account.json';
import { SessionsClient } from '@google-cloud/dialogflow'; // Update import for SessionsClient

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teamsyncai-default-rtdb.firebaseio.com"
});

const corsHandler = cors({ origin: true });

const dialogflowGateway = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    try {
      const { queryInput, sessionId } = request.body;
      const sessionClient = new SessionsClient({ credentials: serviceAccount });
      const sessionPath = sessionClient.sessionPath('teamsyncai', sessionId);
      const responses = await sessionClient.detectIntent({ session: sessionPath, queryInput });
      const result = responses[0].queryResult;
      response.json({ result });
    } catch (error) {
      console.error('Dialogflow request failed:', error);
      response.status(500).send('Error during Dialogflow request');
    }
  });
});

export { dialogflowGateway };
