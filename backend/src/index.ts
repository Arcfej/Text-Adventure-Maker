// Based on https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas
import {Router, IRequest, createCors, error, json} from 'itty-router';
import gameApiHandler from "./game-api/game-api-handler";
import draftsRouteHandler from "./creator-api/drafts-route-handler";
import creatorApiHandler from "./creator-api/creator-api-handler";

const { preflight, corsify } = createCors();

const missingHandler = (request: IRequest) => {
		console.log(request.url);
		return error(405, 'Method not allowed');
};

// Create a new router
const router = Router();

router
		.all('*', preflight)
		.all('/creator/*', creatorApiHandler)
		.all('/games/*', gameApiHandler)
		.all('/creator/drafts/*', draftsRouteHandler)
		.all('*', missingHandler);

export default {
		fetch: (request: IRequest, env: any) => router
				.handle(request, env)
				.then(json)
				.catch((err: any) => {
						console.error(err);
						return error(500)
				})
				.then(corsify)
};
