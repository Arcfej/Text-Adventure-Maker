// Based on https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas
import {Router, IRequest, createCors, error, json} from 'itty-router';
import gameApiHandler from "./game-api/game-api-handler";
import draftsRouteHandler from "./creator-api/drafts-route-handler";
import * as Realm from "realm-web";

const { preflight, corsify } = createCors();

// declare a custom Request type to allow request injection from middleware
export type RequestWithAuth = {
		user: Realm.User;
} & IRequest

let realmApp: Realm.App;

const withAuthorization = async (req: IRequest, env: any) => {
		console.log('withAuthorization');
		try {
				const request = req as RequestWithAuth;
				realmApp = realmApp || new Realm.App(env.REALM_APP_ID);
				const token = request.headers.get('Authorization')?.split(' ')[1];

				if (!token) return error(401, 'Unauthorized');

				const credentials = Realm.Credentials.jwt(token);
				// Attempt to authenticate
				request.user = await realmApp.logIn(credentials);
		} catch (err) {
				console.log(err);
				return error(500);
		}
};

const missingHandler = (request: IRequest) => {
		console.log(request.url);
		return error(405, 'Method not allowed');
};

// Create a new router
const router = Router();

router
		.all('*', preflight)
		.all('/creator/*', withAuthorization)
		.all('/games/*', gameApiHandler)
		.all('/creator/drafts/*', draftsRouteHandler)
		.all('*', missingHandler);

export default {
		fetch: (request: IRequest, env: any) => router
				.handle(request, env)
				.then(json)
				.catch((err: any) => {
						console.error(err);
						return error(500, err.message)
				})
				.then(corsify)
};
