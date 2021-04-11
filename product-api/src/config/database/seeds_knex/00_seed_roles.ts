import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("roles").del();

    // Inserts seed entries
    await knex("roles").insert([
        {
            id: 1,
            name: 'ADMIN',
        },
        {
            id: 2,
            name: 'USER',
        },
        {
            id: 3,
            name: 'WORKER',
        }
    ]);
};
