import {IRequest, Router} from 'itty-router';
import * as utils from "../utils";
import * as Realm from "realm-web";

const ObjectId = Realm.BSON.ObjectID;

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
const withGames = async (request: IRequest, env: any) => {
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

const getGame = async (request: RequestWithGames) => {
		const game = await request.games.findOne({
				_id: new ObjectId(request.params.id)
		});
		return game ? utils.reply(game) : utils.toError('Game not found', 404);
};

const getGames = async (request: RequestWithGames) => {
		console.log('getGames');
		const games = await request.games.find();
		console.log(games);
		const response = utils.reply(games);
		console.log(response);
		return response;
};

const postGame = async (request: RequestWithGames) => {
		const {game, uId} = await request.json();
		return utils.reply(await request.games.insertOne({
				owner: uId,
				intro: game
		}));
};

const updateGame = async (request: RequestWithGames) => {
		const {game} = await request.json();
		const result = await request.games.updateOne(
				{_id: new ObjectId(request.params.id)},
				{$set: {intro: game}}
		);
		return result.matchedCount > 0
				? utils.reply("Game updated")
				: utils.toError('Game not found', 404);
};

const deleteGame = async (request: RequestWithGames) => {
		const result = await request.games.deleteOne({
				_id: new ObjectId(request.params.id)
		});
		return result.deletedCount > 0
				? utils.reply("Game deleted")
				: utils.toError('Game not found', 404);
};

// Create a new router
const router = Router({base: '/games'});

router
		.all('*', withGames)
		.get('/:id', async (request: IRequest) => {
				return await getGame(request as RequestWithGames);
		})
		.get('/', async (request: IRequest) => {
				return await getGames(request as RequestWithGames);
		})
		.post('/', async (request: IRequest) => {
				return await postGame(request as RequestWithGames);
		})
		.patch('/:id', async (request: IRequest) => {
				return await updateGame(request as RequestWithGames);
		})
		.delete('/:id', async (request: IRequest) => {
				return await deleteGame(request as RequestWithGames);
		})

export default router.handle;
