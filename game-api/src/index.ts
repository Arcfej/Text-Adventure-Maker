// // Based on https://github.com/mongodb-developer/cloudflare-worker-rest-api-atlas
import { Router, IRequest} from 'itty-router';
import * as utils from './utils';
import * as Realm from 'realm-web';
import {reply, toError} from "./utils";

// Define type alias; available via `realm-web`
type Document = globalThis.Realm.Services.MongoDB.Document;

// Declare the interface for a Game document
interface Game extends Document {
		owner: string;
		intro: string;
}

type GameCollection = globalThis.Realm.Services.MongoDB.MongoDBCollection<Game>;

// declare a custom Request type to allow request injection from middleware
type RequestWithGames = {
		games: GameCollection;
		uId: string;
} & IRequest

let app: Realm.App;

// Middleware to connect to MongoDB Realm and append userId and games collection to request
const middleware = () => async (request: RequestWithGames, env: any) => {
		try {
				app = app || new Realm.App(env.REALM_APP_ID);
				const credentials = Realm.Credentials.apiKey(env.REALM_API_KEY);
				// Attempt to authenticate
				const user: Realm.User = await app.logIn(credentials);
				const client = user.mongoClient('mongodb-atlas');
				request.uId = user.id;
				request.games = client.db('games').collection<Game>('published');
		} catch (err) {
				console.log(err);
				return utils.toError(500);
		}
};

// Create a new router
const router = Router();
const ObjectId = Realm.BSON.ObjectID;

router.all('*', middleware)
		.get('/games/:id', async (request: IRequest) => {
				const game = await request.games.findOne({
						_id: new ObjectId(request.params.id)
				});
				return game ? reply(game) : toError('Game not found', 404);
		})
		.get('/games', async (request: IRequest) => {
				return reply(await request.games.find());
		})
		.post('/games', async (request: IRequest) => {
				const {game, uId} = await request.json();
				return reply(await request.games.insertOne({
						owner: uId,
						intro: game
				}));
		})
		.patch('/games/:id', async (request: IRequest) => {
				const {game} = await request.json();
				const result = await request.games.updateOne(
						{_id: new ObjectId(request.params.id)},
						{$set: {intro: game}}
				);
				return result.matchedCount > 0
						? reply("Game updated")
						: toError('Game not found', 404);
		})
		.delete('/games/:id', async (request: IRequest) => {
				const result = await request.games.deleteOne({
						_id: new ObjectId(request.params.id)
				});
				return result.deletedCount > 0
						? "Game deleted"
						: toError('Game not found', 404);
		})
		.all('*', () => utils.toError('Method not allowed', 405));

addEventListener('fetch', (event: Event) => {
		try {
				const fetchEvent = event as FetchEvent;
				fetchEvent.respondWith(router.handle(fetchEvent.request));
		} catch (e) {
				console.log(e);
		}
});
