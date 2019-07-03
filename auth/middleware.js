const User = require('../user/model');
const { toData } = require('./jwt');

function auth(req, res, next) {
    const auth = req.headers.authorization && req.headers.authorization.split(' ');
    if(auth && auth[0] === 'Bearer' && auth[1]) {
        try {
            const data = toData(auth[1])
            User
                .findByPk(data.userId)
                .then(user => {
                    if (!user)
                        return next("USER DOES NOT EXIST")
                    req.user = user
                    next()
                })
                .catch(next)
        }
        catch(error) {
            res
                .status(400)
                .send({
                    message: `ERROR ${error.name} : ${error.message}`
                })
        }
    } else {
        res
            .status(401)
            .send({
                message: "PLEASE SUPLY VALID CREDENTIALS"
            })
    }
}

module.exports = auth;