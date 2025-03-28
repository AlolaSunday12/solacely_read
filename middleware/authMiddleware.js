const authCheck = (req, res, next) => {
    console.log("AUTH CHECK - REQ.USER:", req.user);
    console.log("AUTH CHECK - IS AUTHENTICATED:", req.isAuthenticated());

    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    next();
};

module.exports = authCheck;