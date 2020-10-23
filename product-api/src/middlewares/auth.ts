import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).send({ error: 'No token provided'});

    const parts = authHeader.split(' ');

    if(parts.length !== 2) return res.status(401).send({ error: 'Token error'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token malformatted'});

    try {
        const decode: any = jwt.verify(token, process.env.JWT_KEY!);
        req.user = decode;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Falha na autenticação do usuário.'});
    }
}

export default auth;