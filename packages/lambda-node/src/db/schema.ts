import { randomUUID } from "node:crypto";
import {
	integer,
	pgTable,
	unique,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
	"users",
	{
		id: varchar()
			.primaryKey()
			.$default(() => randomUUID()),
		name: varchar({ length: 255 }).notNull(),
		age: integer().notNull(),
		email: varchar({ length: 255 }).notNull(),
	},
	(table) => [
		uniqueIndex("users_email_unique").using(
			"btree_index",
			table.email.asc().nullsLast().op("text_ops"),
		),
		uniqueIndex("users_pkey").using(
			"btree_index",
			table.id.asc().nullsLast().op("text_ops"),
			table.name.asc().nullsLast().op("text_ops"),
			table.age.asc().nullsLast().op("text_ops"),
			table.email.asc().nullsLast().op("text_ops"),
		),
		unique("users_email_unique").on(table.email),
	],
);
