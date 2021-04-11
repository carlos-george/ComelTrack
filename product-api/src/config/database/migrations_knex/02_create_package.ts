import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('packages', table => {
        table.increments('id').primary();
        table.string('trackerNumber').notNullable().unique('idx_trackerNumber');
        table.string('destinationName');
        table.string('observation');
        table.string('description');
        table.string('urlImage');
        table.string('imageKey');
        table.string('nameReceived');
        table.string('docNumber');
        table.string('numProtocol');
        table.string('status').notNullable();
        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
    })
};

export async function down(knex: Knex) {
    return knex.schema.dropTable('packages');
};