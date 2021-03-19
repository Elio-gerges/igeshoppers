const express = require('express');
const router = express.Router();

router.get('/login', async (req, res) => {
    res.status(200).send({
        id: 15,
        name: 'John',
    });
});

module.exports = router;