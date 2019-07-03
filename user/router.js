const { Router } = require('express');
const bcrypt = require('bcrypt');
const User = require('./model');
const Advert = require('../advert/model');
const auth = require('../auth/middleware');

const router = new Router();

// '/users'
//post/CREATE a new user
//no contact info yet --> add here later? as not required?
router.post('/users', (req, res, next) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        password_confirmation: req.body.password_confirmation
    }
    if (user.email && user.password && user.password_confirmation) {
        user.password = bcrypt.hashSync(req.body.password, 10)
        if (bcrypt.compareSync(user.password_confirmation, user.password)) {
            User
                .create(user)
                .then(user => {
                    res
                        .status(201)
                        .send({
                            message: "A NEW USER WAS CREATED",
                            email: user.email,
                            user_id: user.id
                        })
                })
                .catch(error => next(error))
        } else {
            res
                .status(422)
                .send({
                    message: "PLEASE MAKE SURE YOUR PASSWORDS MATCH"
                })
        }
    } else {
        res
            .status(400)
            .send({
                message: "PLEASE FILL IN ALL REQUIRED FIELDS"
            })
    }
})

router.get('/users/:id', auth, (req, res, next) => {
    const seller_id = req.params.id
    const thisUserId = req.user.id
    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: `USER WITH ${seller_id} DOES NOT EXIST`
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: `NOT ALLOWED TO SEE THIS PAGE, NOT YOUR PAGE`
                    })
            } else {
                res
                    .status(200)
                    .send({
                        message: `YOUR USER INFO WITH ID ${seller_id}`,
                        user: user
                    })
            }
        })
        .catch(error => next(error))
})

// update user info --> phone first name last name
router.put('/users/:id', auth, (req, res, next) => {
    const seller_id = req.params.id
    const thisUserId = req.user.id
    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: "THIS USER DOES NOT EXIST"
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: "YOU CANNOT EDIT SOME ONE ELSES'S DATA"
                    })
            } else {
                user
                    .update(req.body)
                    .then(user => {
                        res
                            .status(200)
                            .send({
                                message: "YOUR PROFILE HAS BEEN UPDATED",
                                user: user
                            })
                    })
                    .catch(error => next(error))

            }
        })
        .catch(error => next(error))
})

// '/users/:id/adverts'
router.get('/users/:id/adverts', auth, (req, res, next) => {
    const seller_id = req.params.id
    const thisUserId = req.user.id
    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: "THIS USER DOES NOT EXIST"
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: "THESE ARE NOT YOUR ADVERTS DUDE"
                    })
            } else {
                Advert
                    .findAll({
                        where: {
                            userId: seller_id
                        }
                    })
                    .then(adverts => {
                        res
                            .status(200)
                            .send({
                                message: `ALL (YOUR) ADVERTS`,
                                adverts: adverts
                            })

                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

//user  CREATES new advert on their adverts page
router.post('/users/:id/adverts', auth, (req, res, next) => {
    const seller_id = req.params.id
    const thisUserId = req.user.id
    const newAdvert = {
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        userId: thisUserId
    }
    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: `USER WITH ID ${seller_id} DOES NOT EXIST`
                    })
                return
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: `DID NOT FIND THIS ADVERTS PAGE (THIS IS NOT YOUR PAGE)`
                    })
                return
            } else {
                Advert
                    .create(newAdvert)
                    .then(advert => {
                        res
                            .status(201)
                            .send({
                                message: "A NEW ADVERT WAS CREATED",
                                new_advert: advert
                            })
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

// '/users/:id/adverts/:id'
router.get('/users/:userId/adverts/:id', auth, (req, res, next) => {
    const seller_id = req.params.userId         //this correct?
    const ad_id = req.params.id
    const thisUserId = req.user.id

    console.log("SELLER ID", seller_id)
    console.log("AD ID", ad_id)
    console.log("THIS USER ID", thisUserId)

    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: "USER WITH THIS IS DOES NOT EXIST"
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: "THIS IS NOT YOUR ADVERT DUDE"
                    })
            } else {
                Advert
                    .findAll({
                        where: {
                            userId: user.id,
                            id: ad_id
                        }
                    })
                    .then(advert => {
                        if (advert.length === 0) {
                            res
                                .status(404)
                                .send({
                                    message: "YOUR ADVERT WITH THIS ID DOES NOT EXIST"
                                })
                        } else {
                            res
                                .status(200)
                                .send({
                                    message: `YOUR ADVERT WITH ID ${ad_id}`,
                                    advert: advert
                                })
                        }
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

//update advert
router.put('/users/:userId/adverts/:id', auth, (req, res, next) => {
    const seller_id = req.params.userId
    const ad_id = req.params.id
    const thisUserId = req.user.id

    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: "USER WITH THIS IS DOES NOT EXIST"
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: "THIS IS NOT YOUR ADVERT DUDE"
                    })
            } else {
                Advert
                    .findAll({
                        where: {
                            userId: user.id,
                            id: ad_id
                        }
                    })
                    .then(advert => {
                        if (advert.length === 0) {
                            res
                                .status(404)
                                .send({
                                    message: "YOUR ADVERT WITH THIS ID DOES NOT EXIST"
                                })
                        } else {
                            advert
                                .update(req.body)
                                .then(advert => {
                                    res
                                        .status(200)
                                        .send({
                                            message: `YOUR ADVERT WITH ID ${ad_id} HAS BEEN UPDATED`,
                                            advert: advert
                                        })
                                })
                                .catch(error => next(error))
                        }
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

//delete advert
router.delete('/users/:userId/adverts/:id', auth, (req, res, next) => {
    const seller_id = req.params.userId
    const ad_id = req.params.id
    const thisUserId = req.user.id

    User
        .findByPk(seller_id)
        .then(user => {
            if (!user) {
                res
                    .status(404)
                    .send({
                        message: "USER WITH THIS IS DOES NOT EXIST"
                    })
            } else if (user.id !== thisUserId) {
                res
                    .status(404)
                    .send({
                        message: "THIS IS NOT YOUR ADVERT DUDE"
                    })
            } else {
                Advert
                    .findAll({
                        where: {
                            userId: user.id,
                            id: ad_id
                        }
                    })
                    .then(advert => {
                        if (advert.length === 0) {
                            res
                                .status(404)
                                .send({
                                    message: "YOUR ADVERT WITH THIS ID DOES NOT EXIST"
                                })
                        } else {
                            advert
                                .destroy()
                                .then(response => {
                                    res
                                        .status(200)
                                        .send({
                                            message: `YOUR ADVERT WITH ID ${ad_id} HAS BEEN DELETED`
                                        })
                                })
                                .catch(error => next(error))
                        }
                    })
                    .catch(error => next(error))
            }
        })
        .catch(error => next(error))
})

module.exports = router