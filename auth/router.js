const { Router } = require('express');
const { toJWT } = require('./jwt');
const bcrypt = require('bcrypt');
const User = require('../user/model');

const router = new Router();

// '/login'
// post and compare email and password
//  if valid --> link to '/'
router.post('/logins', (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (email && password) {
        User
            .findOne({
                where: {
                    email: email
                }
            })
            .then(entity => {
                if (!entity) {
                    res
                        .status(400)
                        .send({
                            message: "USER OR PASSWORD IS INCORRECT"
                        })
                } else {
                    if (bcrypt.compareSync(password, entity.password)) {
                        res
                            .status(200)
                            .send({
                                message: "JWT",
                                JWT: toJWT({ userId: entity.id })
                            })
                    } else {
                        res
                            .status(400)
                            .send({
                                message: "PASSWORD IS INCORRECT"
                            })
                    }
                }
            })
            .catch(error => next(error))
    } else {
        res
            .status(400)
            .send({
                message: "PLEASE SUPPLY VALID EMAIL AND PASSWORD"
            })

    }
})

module.exports = router;