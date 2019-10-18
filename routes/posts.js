const router = require('express').Router();
const verify = require('./verifyToken');

// Random api serving functionality
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

module.exports = router;
