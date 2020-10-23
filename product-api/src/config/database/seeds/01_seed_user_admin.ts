import * as Knex from "knex";
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    const users = await knex("users").where('users.email', '=', 'admin@comel.com.br');
    const userAdmin = users[0];
    if (!userAdmin) {
        const hash = await bcrypt.hash('comel123456', 10);
        await knex("users").insert([
            {
                name: 'admin',
                email: 'admin@comel.com.br',
                password: hash,
                whatsapp: '61981268810',
            },
        ]);
        const newUsers = await knex("users").where('users.email', '=', 'admin@comel.com.br');
        const newUserAdmin = newUsers[0];

        const roles = await knex('roles').where('roles.name', '=', 'ADMIN');
        const roleAdmin = roles[0];

        await knex("users_roles").insert([
            {
                user_id: newUserAdmin.id,
                role_id: roleAdmin.id,
            },
        ]);
    }
    // Inserts seed entries
};

