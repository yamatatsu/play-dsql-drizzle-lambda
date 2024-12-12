import { randomUUID } from "node:crypto";
import { usersTable } from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const dbPromise = generateDrizzleClient();

export const handler = async () => {
	const db = await dbPromise;

	const user = {
		name: "Alice",
		age: 20,
		email: `${randomUUID()}@example.com`,
	} satisfies typeof usersTable.$inferInsert;

	console.time("query");
	await db.insert(usersTable).values(user);
	console.timeEnd("query");
};
