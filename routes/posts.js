const router = require('express').Router();
const verify = require('./verifyToken');

// Random api serving functionality with authentication
router.get('/', verify, (req, res) => {
    res.json({
        posts: [{
            title: 'First Post',
            description: 'Secret post!'
        }],
        // api function can now perform business logic based on user info
        user: req.user
    });
});

// Unsecured endpoint
router.get('/test', (req, res) => {
    res.status(200).send('Unsecured endpoint testing success!');
});

module.exports = router;
