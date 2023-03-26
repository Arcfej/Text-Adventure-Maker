// Based on https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas
import { Router, IRequest} from 'itty-router';
import gameApiHandler from "./game-api/game-api-handler";
import * as utils from './utils';

export const withCorsPreflight = (request: IRequest) => {
		if (request.method.toLowerCase() === 'options') {
				return new Response('ok', {
						headers: utils.corsHeaders,
				});
		}
};

const missingHandler = () => utils.toError('Method not allowed', 405);

// Create a new router
const router = Router();

router
		.all('*', withCorsPreflight)
		.all('/games', gameApiHandler)
		.all('*', missingHandler);

export default {
		fetch: router.handle
};
