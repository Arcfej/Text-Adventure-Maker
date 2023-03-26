// Based on https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas
import {Router, IRequest, createCors, error, json} from 'itty-router';
import gameApiHandler from "./game-api/game-api-handler";

const { preflight, corsify } = createCors();

const missingHandler = () => error(405, 'Method not allowed');

// Create a new router
const router = Router();

router
		.all('*', preflight)
		.all('/games', gameApiHandler)
		.all('*', missingHandler);

export default {
		fetch: (request: IRequest, env: any) => router
				.handle(request, env)
				.then(json)
				.catch(error)
				.then(corsify)
};
