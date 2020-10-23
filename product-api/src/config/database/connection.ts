import knex from 'knex';
import path from 'path';
import { attachPaginate } from 'knex-paginate';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'database.sqlite')
    },
    useNullAsDefault: true,
});

attachPaginate();

export default db;