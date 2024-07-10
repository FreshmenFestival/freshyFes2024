import jwt from 'jsonwebtoken';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const createToken = (uid: string, group: string, name: string) => {
    const payload = {
        uid,
        group,
        name
    };

    const token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256', expiresIn: '7d' });

    return token;
}
