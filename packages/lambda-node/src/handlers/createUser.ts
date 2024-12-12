import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { usersTable } from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const db = await generateDrizzleClient();
const insertUser = db
	.insert(usersTable)
	.values({
		id: sql.placeholder("id"),
		name: "Alice",
		age: 20,
		email: sql.placeholder("email"),
	})
	.prepare("insertUser");

export const handler = async () => {
	const uuid = randomUUID();

	console.time("query");
	await insertUser.execute({ id: uuid, email: `${uuid}@example.com` });
	console.timeEnd("query");
};
