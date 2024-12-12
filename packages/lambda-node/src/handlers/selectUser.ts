import { sql } from "drizzle-orm";
import { usersTable } from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const dbPromise = generateDrizzleClient();

const selectUsersPromise = dbPromise.then((db) =>
	db.select().from(usersTable).prepare("selectUsers"),
);

type Event = { id: string };
export const handler = async (event: Event) => {
	const selectUsers = await selectUsersPromise;

	console.time("query");
	const users = await selectUsers.execute();
	console.timeEnd("query");

	console.log(JSON.stringify(users, null, 2));

	return users;
};
