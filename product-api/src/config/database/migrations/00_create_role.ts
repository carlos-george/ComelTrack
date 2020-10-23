import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('roles', table => {
        table.integer('id').primary();
        table.string('name').notNullable();
    })
};

export async function down(knex: Knex) {
    return knex.schema.dropTable('roles');
};