const authCheck = (req, res, next) => {
    console.log("AUTH CHECK - REQ.USER:", req.user);
    console.log("AUTH CHECK - IS AUTHENTICATED:", req.isAuthenticated());

    if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    next();
};

/*
const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
*/
module.exports = authCheck;