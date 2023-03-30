import {error, json, IRequest, Router} from 'itty-router';
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

let realmApp: Realm.App;

// Middleware to connect to MongoDB Realm and append userId and games collection to request
const withGames = async (request: IRequest, env: any) => {
		try {
				realmApp = realmApp || new Realm.App(env.REALM_APP_ID);
				const token = request.headers.get('Authorization')?.split(' ')[1];
				const credentials = token
						? Realm.Credentials.jwt(token)
						: Realm.Credentials.anonymous();
				// Attempt to authenticate
				const user: Realm.User = await realmApp.logIn(credentials);
				const client = user.mongoClient('mongodb-atlas');
				request.uId = user.id;
				request.games = client.db('games').collection<Game>('published');
		} catch (err) {
				console.log(err);
				return error(500);
		}
};

const getGame = async (request: RequestWithGames) => {
		const game = await request.games.findOne({
				_id: new ObjectId(request.params.id)
		});
		return game ? json(game) : error(404, 'Game not found');
};

const getGames = async (request: RequestWithGames) => {
		const games = await request.games.find();
		return json(games);
};

const postGame = async (request: RequestWithGames) => {
		const {uId} = request;
		const {game} = await request.json();
		return json(await request.games.insertOne({
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
				? json("Game updated")
				: error(404, 'Game not found');
};

const deleteGame = async (request: RequestWithGames) => {
		const result = await request.games.deleteOne({
				_id: new ObjectId(request.params.id)
		});
		return result.deletedCount > 0
				? json("Game deleted")
				: error(404, 'Game not found');
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
