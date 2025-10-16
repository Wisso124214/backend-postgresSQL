import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT con la data del usuario
 * @param {Object} userData - Información del usuario para el payload
 * @returns {string} Token JWT
 */
export const generateToken = (userData) =>  {
	const secret = process.env.JWT_SECRET || 'default_secret';
	return jwt.sign(userData, secret, { expiresIn: '1h' });
}

export const verifyToken = (token) => {
	const secret = process.env.JWT_SECRET || 'default_secret';
	try {
		return jwt.verify(token, secret);
	} catch (error) {
		return null;
	}
};