import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import db from '../config/database/connection';

interface UserModel {
    id: number;
    name: string;
    email: string;
    password: string;
    whatsapp: string;
}

const generateToken = (params = {}) => {
    return jwt.sign(params,
        process.env.JWT_KEY!,
        {
            expiresIn: 86400
        });
}

class UserController {


    async register(request: Request, response: Response) {

        const { name, email, password, whatsapp } = request.body;

        const passHash = await bcrypt.hash(password, 10);

        const trx = await db.transaction();

        const users = await trx('users').where('users.email', '=', email);

        if (users[0]) return response.status(400)
            .json({
                message: 'Usuário já existente no sistema.'
            });

        try {

            const userIds = await trx('users').insert({ name, email, password: passHash, whatsapp });

            const roles = await trx('roles').where('roles.name', '=', 'USER');

            await trx('users_roles').insert({
                user_id: userIds[0],
                role_id: roles[0].id
            })

            const newUsers = await trx('users').where('users.id', '=', userIds[0]).select('*');

            const newUser: UserModel = newUsers[0];

            newUser.password = '';

            trx.commit();

            return response.json({ newUser, token: generateToken({ id: newUser.id }) });

        } catch (error) {

            console.log(error);
            await trx.rollback();

            return response.status(400).json({
                error: 'Erro inesperado ao cadatrar novo usuário.'
            });
        }

    }

    async authenticate(request: Request, response: Response) {
        const { email, password } = request.body;

        const users = await db('users').where('users.email', '=', email);

        const user = users[0];

        if (!user) return response.status(400)
            .json({
                message: 'Usuário não encontrado.'
            });

        if (!await bcrypt.compare(password, user.password))
            return response.status(400).json({ message: 'Senha inválida para o usuário.' });

        user.password = undefined;

        return response.json({ user, token: generateToken({ id: user._id }) });
    }

    // async createPackage(request: CustomRequest, response: Response) {
    //     const { id } = request.user;
    //     const { trackerNumber, description } = request.body;
    //     const user = await User.findById(id);

    //     if (!user) return response.status(400).json({ message: 'Usuário não encontrado.' });

    //     const product: any = await Product.findOne({ trackerNumber });

    //     let status = 0;
    //     let urlImage = '';

    //     if (product) {
    //         status = 1;
    //         urlImage = product.urlImage;
    //     }

    //     const userPackage = await Package.create({ trackerNumber, description, status, urlImage, owner: user._id });

    //     await user.updateOne({ packages: [userPackage._id] });

    //     return response.json(userPackage);
    // }

    // async listPackages(request: CustomRequest, response: Response) {

    //     const { id: owner } = request.user;
    //     const { page = 1 } = request.query;

    //     const packages = await Package.paginate({ owner }, { page: Number(page), limit: 10 });

    //     return response.json(packages);
    // }

    // async showPackage(request: Request, response: Response) {

    //     const { id } = request.params;

    //     const userPackage = await Package.findById(id);

    //     if (!userPackage) return response.status(400).json({ message: 'Encomenda não encontrada.' });

    //     return response.json(userPackage);
    // }

}

export default UserController;