import {error, IRequest, Router} from "itty-router";
import * as Realm from "realm-web";
import draftsRouteHandler from "./drafts-route-handler";

// declare a custom Request type to allow request injection from middleware
export type RequestWithAuth = {
		user: Realm.User;
} & IRequest

let realmApp: Realm.App;

const withAuthorization = async (req: IRequest, env: any) => {
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

const router = Router({base: '/creator'});

router
		.all('*', withAuthorization)
		.all('/drafts', draftsRouteHandler);

export default router.handle;
