const Sequelize = require('sequelize');
const db = require('../db');
const User = require('../user/model')

const Advert = db.define(
    'advert',
    {
        title: {
            type: Sequelize.STRING,
            field: "ad_title"
        },
        price: {
            type: Sequelize.DECIMAL(10,2),          //(10,2) --> 2 decimals? hondereds possible?
            field: "ad_price"
        },
        description: {
            type: Sequelize.STRING,
            field: "ad_description"
        },
        image: {
            type: Sequelize.STRING,
            field: "ad_image_url"
        }
    },{
        timestamps: false,
        tableName: 'adverts'
    }
)

Advert.belongsTo(User);

module.exports = Advert;