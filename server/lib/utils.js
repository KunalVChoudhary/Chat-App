import jwt from 'jsonwebtoken';

//Generate JWT token
export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};