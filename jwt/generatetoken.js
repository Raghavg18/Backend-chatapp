import jwt from 'jsonwebtoken';

const createTokenAndSaveCookie = (userid, res) => {
    const token = jwt.sign({userid}, process.env.JWT_TOKEN, {
        expiresIn: '5d'
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    })
}

export default createTokenAndSaveCookie;