import path from 'path';

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, 'src', 'config', 'database', 'database.sqlite')
    },
    migrations: {
        directory: path.resolve(__dirname, 'src', 'config', 'database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src', 'config', 'database', 'seeds')
    },
    useNullAsDefault: true
};