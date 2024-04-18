export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso no autorizado'
        });
    }
};

export const isUser = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'user') {
        return next();
    } else {
        return res.status(403).json({
            status: 'error',
            message: 'Acceso no autorizado'
        });
    }
};