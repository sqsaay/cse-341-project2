const router = require('express').Router();

router.use('/', require('./swagger'));
router.use('/owners', require('./owners'));
router.use('/pets', require('./pets'));

router.get('/', (req, res) => { 
    //#swagger.tags=['Home']
    res.send('Home'); });

module.exports = router;