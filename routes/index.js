const router = require('express').Router();
const passport = require('passport');
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[character]));

router.use('/', require('./swagger'));
router.use('/owners', require('./owners'));
router.use('/pets', require('./pets'));

router.get('/', (req, res) => {
    //#swagger.tags=['Home']
    const user = req.session?.user;
    const displayName = user?.displayName || user?.username;
    const greeting = displayName
        ? `<p>Signed in as ${escapeHtml(displayName)}</p>`
        : '';
    const authLink = user
        ? '<a href="/logout">Log out of GitHub</a>'
        : '<a href="/login">Log in with GitHub</a>';
    res.type('html').send(`<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Pet API</title></head>
<body>
  <h1>Pet API</h1>
    ${greeting}
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