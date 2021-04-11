import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'config', 'database', 'database.Old.sqlite')
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'config', 'database', 'migrations_knex')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'config', 'database', 'seeds_knex')
    },
    pool: {
        max: 50,
        min: 2,
        acquireTimeout: 60 * 1000,
        propagateCreateError: false // <- default is true, set to false
    },
    useNullAsDefault: true
};