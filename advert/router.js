const {Router} = require('express');
const Advert = require('./model');
const User = require('../user/model');
const auth = require('../auth/middleware');

const router = new Router();

// '/'

//get all adverts
router.get('/', (req, res, next) => {
    Advert
        .findAll()
        .then(adverts => {
            if(adverts.length === 0) {
                res
                    .status(200)
                    .send({
                        message: "CURRENTLY THERE ARE NO ADVERTS"
                    })
            }
            res
                .status(200)
                .send({
                    message: "ALL CURRENT ADVERTS",
                    adverts: adverts
                })
        })
        .catch(error => next(error))
})


// '/adverts/:id'

//get advert where id === :id
//get user(seller) contact info
router.get('/adverts/:id', (req, res, next) => {
    const ad_id = req.params.id
    Advert
        .findByPk(ad_id)
        .then(advert => {
            if (!advert) {
                res
                    .status(404)
                    .send({
                        message: "ADVERT WITH THAT ID DOES NOT EXIST"
                    })
            } else {
                res
                    .status(200)
                    .send({
                        message: `ADVERT WITH ${ad_id}`,
                        advert: advert
                    })
            }
        })
})

// '/adverts/users/:id
// get all ads belonging to user with id --> :id
router.get('/adverts/users/:id', (req, res, next) => {
    const seller_id = req.params.id             //this correct?
    Advert
        .findAll({
            where: {
                userId: seller_id
            }
        })
        .then(adverts => {
            //check is adverts arent empty if so --> user had nothing for sale
            res
                .status(200)
                .send({
                    message: `ALL ADVERTS OF USER WITH ID ${seller_id}`,
                    adverts: adverts
                })
        })
        .catch(error => next(error))
})

module.exports = router;