const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));
router.use('/owners', require('./owners'));
router.use('/pets', require('./pets'));

router.get('/', (req, res) => {
    //#swagger.tags=['Home']
    const authLink = req.session?.user
        ? '<a href="/logout">Log out of GitHub</a>'
        : '<a href="/login">Log in with GitHub</a>';
    res.type('html').send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Pet API</title></head>
<body>
  <h1>Pet API</h1>
  <p>${authLink}</p>
  <p><a href="/api-docs">API documentation</a></p>
</body>
</html>`);
});

router.get('/login', passport.authenticate('github'), (req, res) => { });

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        delete req.session.user;
        res.redirect('/');
    });
});

module.exports = router;