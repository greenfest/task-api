const passport = require('passport');
const LocalStrategy = require('passport-local');
const Users = require('../models/Users');


passport.use("signup", new LocalStrategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]',
}, (email, password, done) => {
    Users.findOne({ email })
        .then((user) => {
            if(!user || !user.validatePassword(password)) {
                return done(null, false, { errors: { 'email or password': 'is invalid' } });
            }

            return done(null, user);
        }).catch(done);
}));

passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'user[email]',
            passwordField: 'user[password]'
        },
        async (email, password, done) => {
            try {
                const user = await Users.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const validate = await user.validatePassword(password);
                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);