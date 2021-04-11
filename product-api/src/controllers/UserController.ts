import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../entities/User';
import Role from '../entities/Role';
import UserView from '../views/UserView';

const generateToken = (params = {}) => {
    return jwt.sign(params,
        process.env.JWT_KEY!,
        {
            expiresIn: 86400
        });
}

export default {
    async index(request: Request, response: Response) {

        const userRepository = getRepository(User);

        const users = await userRepository.find({
            relations: ['usersroles', 'usersroles.role']
        });

        return response.json(UserView.renderMany(users));
    },

    async register(request: Request, response: Response) {

        const userRepository = getRepository(User);
        const roleRepository = getRepository(Role);

        const { name, email, password } = request.body;

        const passHash = await bcrypt.hash(password, 10);

        const users = await userRepository.find({
            where: [
                {
                    email
                }
            ]
        });

        if (users[0]) return response.status(400)
            .json({
                message: 'Usuário já existente no sistema.'
            });


        const role = await roleRepository.findOne(2);

        const data = {
            name,
            email,
            password: passHash,
            usersroles: [
                {
                    role
                }
            ]
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password: Yup.string().required(),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        const user = await userRepository.create(data);

        await userRepository.save(user);

        return response.status(201).json({ user: UserView.render(user), token: generateToken({ id: user.id }) });

    },

    async authenticate(request: Request, response: Response) {

        const userRepository = getRepository(User);

        const { email, password } = request.body;

        const users = await userRepository.find({
            relations: ['usersroles', 'usersroles.role'],
            where: [
                {
                    email
                }
            ]
        });

        const user = users[0];

        if (!user) return response.status(400)
            .json({
                message: 'Usuário não encontrado.'
            });

        if (!await bcrypt.compare(password, user.password))
            return response.status(400).json({ message: 'Senha inválida para o usuário.' });

        return response.json({ user: UserView.render(user), token: generateToken({ id: user.id }) });
    }
}