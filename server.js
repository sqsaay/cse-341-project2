const express = require('express');

const mongodb = require ('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const app = express();
const { notFound, handleError } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3010;
// const sessionSecret = process.env.SESSION_SECRET;

// if (process.env.NODE_ENV === 'production' && !sessionSecret) {
//     throw new Error('SESSION_SECRET must be set in production');
// }

app.use(express.json());
app.enable('trust proxy');
// app.use(session({
//     secret: sessionSecret || 'local-development-only-secret',
//     resave: false,
//     saveUninitialized: false
// }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
    // Here you would typically save the user profile to your database
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });

app.use('/', require('./routes'));
app.use(notFound);
app.use(handleError);

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }else{
        app.listen(PORT, () => {
        console.log(`Database is listening and server is running on port ${PORT}`);
});
    }
})

