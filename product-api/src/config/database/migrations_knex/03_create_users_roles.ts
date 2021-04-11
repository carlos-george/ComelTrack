import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('users_roles', table => {
        table.increments('id').primary();

        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

        table.integer('role_id')
            .notNullable()
            .references('id')
            .inTable('roles')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

    })
};

export async function down(knex: Knex) {
    return knex.schema.dropTable('users_roles');
};