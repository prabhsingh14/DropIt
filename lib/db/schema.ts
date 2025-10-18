import { pgTable, text, uuid, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const files = pgTable('files', {
    id: uuid('id').primaryKey().defaultRandom(),

    // files/folders info
    name: text('name').notNull(),
    path: text('path').notNull(),
    size: integer('size').notNull(),
    type: text('type').notNull(), //folder/file

    // storage info
    fileUrl: text('fileUrl').notNull(),
    thumbnailUrl: text('thumbnailUrl'),

    // ownership info
    userId: uuid('userId').notNull(),
    parentId: uuid('parentId'),

    // file/folder flags
    isFolder: boolean('isFolder').notNull().default(false),
    isStarred: boolean('isStarred').notNull().default(false),
    isTrashed: boolean('isTrashed').notNull().default(false),

    // timestamps
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const filesRelations = relations(files, ({ one, many }) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),
    children: many(files)
}));

// type definitions
export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert; 