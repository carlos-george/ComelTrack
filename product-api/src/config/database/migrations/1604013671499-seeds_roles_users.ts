import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from 'bcrypt';

export class SeedsRolesUsers1604013671499 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`insert into roles(id, name) values (1, 'ADMIN')`);
        await queryRunner.query(`insert into roles(id, name) values (2, 'USER')`);
        await queryRunner.query(`insert into roles(id, name) values (3, 'WORKER')`);

        await queryRunner.query(`insert into users(name, password, email) values ('admin', '${await bcrypt.hash('123456', 10)}', 'admin@contato.com')`);

        await queryRunner.query(`insert into users_roles(user_id, role_id) values (1,1)`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // nothing to do
    }

}
