import {error, IRequest, json, Router} from 'itty-router';
import * as Realm from "realm-web";
import type {ObjectId} from "bson";
import type {RequestWithAuth} from "./creator-api-handler";
import type {MongoDBRealmError} from "realm-web";

const objectId = Realm.BSON.ObjectID;

// Define type alias; available via `realm-web`
type Document = globalThis.Realm.Services.MongoDB.Document;

// Declare the interface for a Game document
interface Drafts extends Document {
		owner_id: string;
		title: string;
		_id: ObjectId;
		graph: {
				nodes: Array<{
						id: string;
						position: { x: number; y: number };
						data: any;
				}>
				edges: Array<{
						id: string;
						source: string;
						target: string;
				}>
				idCounter: number;
		}
}

type DraftCollection = globalThis.Realm.Services.MongoDB.MongoDBCollection<Drafts>;

// declare a custom Request type to allow request injection from middleware
type RequestWithDrafts = {
		drafts: DraftCollection;
} & RequestWithAuth

const withDrafts = async (req: IRequest) => {
		try {
				const request = req as RequestWithDrafts;
				const client = request.user.mongoClient('mongodb-atlas');
				request.drafts = client.db('games').collection<Drafts>('drafts');
		} catch (err) {
				console.log(err);
				return error(500);
		}
};

const getDraft = async (request: RequestWithDrafts) => {
		const draft = await request.drafts.findOne({
				_id: new objectId(request.params.id)
		});
		return draft ? json(draft) : error(404, 'Draft not found');
};

const getDrafts = async (request: RequestWithDrafts) => {
		const drafts = await request.drafts.find({
				owner_id: request.user.id
		}, {
				projection: {
						title: 1,
				}
		});
		return json({drafts: drafts});
};

const postDraft = async (request: RequestWithDrafts) => {
		const {user: {id}} = request;
		const {draft: {title}} = await request.json();

		if (!title || typeof title === 'undefined') return error(400, 'Title is required');

		const conflict = await request.drafts.findOne({
				owner_id: id,
				title: title,
		});
		if (conflict) return error(409, 'Project with this title already exists');

		const insertedId = (await request.drafts.insertOne({
				owner_id: id,
				title: title,
				graph: {
						nodes: [{
								id: '1',
								position: {x: 0, y: 0},
								data: {
										label: 'Start your story here'
								}
						}],
						edges: [],
						idCounter: 2
				}
		})).insertedId;

		return json(await request.drafts.findOne({_id: insertedId}));
};

const updateDraft = async (request: RequestWithDrafts) => {
		const {draft} = await request.json();
		try {
				const result = await request.drafts.updateOne(
						{_id: new objectId(request.params.id)},
						{$set: draft}
				);
				return result.matchedCount > 0
						? json("Draft updated")
						: error(404, 'Draft not found');
		} catch (e) {
				const err = e as MongoDBRealmError;
				if (err.errorCode === 'SchemaValidationFailedWrite') {
						return error(400, 'Invalid data');
				}
		}
};

const deleteDraft = async (request: RequestWithDrafts) => {
		const result = await request.drafts.deleteOne({
				_id: new objectId(request.params.id)
		});
		return result.deletedCount > 0
				? json("Draft deleted")
				: error(404, 'Draft not found');
};

// Create a new router
const router = Router({base: '/creator/drafts'});

router
		.all('*', withDrafts)
		.get('/:id', async (request: IRequest) => {
				return await getDraft(request as RequestWithDrafts);
		})
		.get('/', async (request: IRequest) => {
				return await getDrafts(request as RequestWithDrafts);
		})
		.post('/', async (request: IRequest) => {
				return await postDraft(request as RequestWithDrafts);
		})
		.patch('/:id', async (request: IRequest) => {
				return await updateDraft(request as RequestWithDrafts);
		})
		.delete('/:id', async (request: IRequest) => {
				return await deleteDraft(request as RequestWithDrafts);
		});

export default router.handle;
