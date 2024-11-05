const JWT = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ error: 'No token provided, authorization denied' });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.employeeId = decoded.id;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Token is not valid' });
    }
};

module.exports = { authenticateUser };
