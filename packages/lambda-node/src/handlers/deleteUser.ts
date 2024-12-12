import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema.js";
import { generateDrizzleClient } from "../utils.js";

const dbPromise = generateDrizzleClient();

export const handler = async () => {
	const db = await dbPromise;

	console.time("query");
	await db.delete(usersTable);
	console.timeEnd("query");
};
