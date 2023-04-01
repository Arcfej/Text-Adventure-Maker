import {error, IRequest, json, Router} from 'itty-router';
import * as Realm from "realm-web";
import type {ObjectId} from "bson";
import type {RequestWithAuth} from "../index";

const objectId = Realm.BSON.ObjectID;

// Define type alias; available via `realm-web`
type Document = globalThis.Realm.Services.MongoDB.Document;

// Declare the interface for a Game document
interface Drafts extends Document {
		owner: string;
		intro: string;
		_id: ObjectId;
}

type DraftCollection = globalThis.Realm.Services.MongoDB.MongoDBCollection<Drafts>;

// declare a custom Request type to allow request injection from middleware
type RequestWithDrafts = {
		drafts: DraftCollection;
} & RequestWithAuth

const withDrafts = async (req: IRequest) => {
		console.log("withDrafts");
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
		const draft = await request.drafts.find();
		return json(draft);
};

const postDraft = async (request: RequestWithDrafts) => {
		const {user: {id}} = request;
		const {draft} = await request.json();
		return json(await request.drafts.insertOne({
				owner: id,
				intro: draft
		}));
};

const updateDraft = async (request: RequestWithDrafts) => {
		const {draft} = await request.json();
		const result = await request.drafts.updateOne(
				{_id: new objectId(request.params.id)},
				{$set: {intro: draft}}
		);
		return result.matchedCount > 0
				? json("Draft updated")
				: error(404, 'Draft not found');
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
const router = Router({base: '/creator'});

router
		.all('/drafts', withDrafts)
		.get('/drafts/:id', async (request: IRequest) => {
				return await getDraft(request as RequestWithDrafts);
		})
		.get('/drafts/', async (request: IRequest) => {
				return await getDrafts(request as RequestWithDrafts);
		})
		.post('/drafts/', async (request: IRequest) => {
				return await postDraft(request as RequestWithDrafts);
		})
		.patch('/drafts/:id', async (request: IRequest) => {
				return await updateDraft(request as RequestWithDrafts);
		})
		.delete('/drafts/:id', async (request: IRequest) => {
				return await deleteDraft(request as RequestWithDrafts);
		});

export default router.handle;
