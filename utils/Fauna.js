/** @format */

import { Client, query } from "faunadb";

const faunaClient = new Client({
	secret: process.env.FAUNA_SECRET,
	domain: process.env.FAUNA_DOMAIN,
});

const q = query;

const getTweets = async () => {
	const { data } = await faunaClient.query(
		q.Map(
			q.Paginate(q.Match(q.Index("all_tweets_sorted_by_ts_desc"))),
			q.Lambda(["ts", "ref"], q.Get(q.Var("ref")))
		)
	);
	const tweets = data.map((tweet) => {
		tweet.id = tweet.ref.id;
		delete tweet.ref;
		return tweet;
	});

	return tweets;
};

const getTweetById = async (id) => {
	const tweet = await faunaClient.query(
		q.Get(q.Ref(q.Collection("tweets"), id))
	);

	tweet.id = tweet.ref.id;
	delete tweet.ref;

	return tweet;
};

const getTweetsByUserId = async (userId) => {
	const { data } = await faunaClient.query(
		q.Map(
			q.Paginate(
				q.Match(q.Index("tweets_by_userId_sorted_by_ts_desc"), userId)
			),
			q.Lambda(["ts", "ref"], q.Get(q.Var("ref")))
		)
	);
	const tweets = data.map((tweet) => {
		tweet.id = tweet.ref.id;
		delete tweet.ref;
		return tweet;
	});

	return tweets;
};

const createTweet = async (title, topic, body, userId) => {
	let createdTweet = await faunaClient.query(
		q.Create(q.Collection("tweets"), {
			data: {
				title,
				topic,
				body,
				userId,
			},
		})
	);

	createdTweet.id = createdTweet.ref.id;
	delete createdTweet.ref;

	return createdTweet;
};

const updateTweet = async (id, title, topic, body) => {
	let updatedTweet = await faunaClient.query(
		q.Update(q.Ref(q.Collection("tweets"), id), {
			data: {
				title,
				topic,
				body,
			},
		})
	);

	updatedTweet.id = updatedTweet.ref.id;
	delete updatedTweet.ref;

	return updatedTweet;
};

const deleteTweet = async (id) => {
	let deletedTweet = await faunaClient.query(
		q.Delete(q.Ref(q.Collection("tweets"), id))
	);

	deletedTweet.id = deletedTweet.ref.id;
	delete deletedTweet.ref;

	return deletedTweet;
};

export {
	createTweet,
	getTweets,
	getTweetById,
	updateTweet,
	deleteTweet,
	getTweetsByUserId,
};
