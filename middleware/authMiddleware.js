// Auth check middleware to protect routes
const authCheck = (req, res, next) => {
    if (!req.isAuthenticated() || !req.user) {
        return res.redirect('/auth/login'); // Redirect to login if user is not authenticated
    }
    next();
};

module.exports = authCheck;