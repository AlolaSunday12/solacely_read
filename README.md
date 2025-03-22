/project-root
│── /config
│   ├── passport.js       # Passport middleware configuration
│   ├── googleStrategy.js # Google OAuth strategy configuration
│   ├── facebookStrategy.js # Facebook OAuth strategy configuration
│   ├── localStrategy.js  # Local authentication strategy configuration
│── /controllers
│   ├── authController.js # Handles login, logout, and registration logic
│   ├── userController.js # Handles user-related actions (profile, update, etc.)
│   ├── blogController.js # Handles blog-related actions (if applicable)
│── /middlewares
│   ├── authMiddleware.js # Protects routes (e.g., requireAuth)
│── /models
│   ├── User.js           # Mongoose model for User
│   ├── Blog.js           # Mongoose model for Blog (if applicable)
│── /routes
│   ├── authRoutes.js     # Routes for authentication (login, register, logout)
│   ├── userRoutes.js     # Routes for user-related operations
│   ├── blogRoutes.js     # Routes for blog-related operations (if applicable)
│── /utils
│   ├── validateUser.js   # Function to validate user input (email, password)
│   ├── sendEmail.js      # Function to send emails (if needed)
│── /services
│   ├── authService.js    # Handles authentication logic (JWT, session management)
│── /public               # Store static files (optional)
│── /views                # Store template files (if applicable)
│── .env                  # Environment variables (PORT, MongoDB URI, JWT secret, etc.)
│── .gitignore            # Ignore node_modules, .env, etc.
│── server.js             # Main entry point of the application
│── package.json          # Project dependencies and scripts

Explanation of Key Files:
config/passport.js: Imports Google, Facebook, and Local strategies.

config/googleStrategy.js: Configures Google authentication.

config/facebookStrategy.js: Configures Facebook authentication.

config/localStrategy.js: Configures Local authentication (email & password).

controllers/authController.js: Handles user registration, login, and logout.

middlewares/authMiddleware.js: Middleware to protect routes.

models/User.js: Defines the Mongoose schema for the User.

routes/authRoutes.js: Defines authentication routes (/login, /register, etc.).

services/authService.js: Handles authentication logic like generating JWT tokens.