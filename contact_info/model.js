const Sequelize = require('sequelize');
const db = require('../db');
const User = require('../user/model');

const ContactInfo = db.define(
    'contact_info',
    {
        firstName: {
            type: Sequelize.STRING,
            field: 'first_name'
        },
        lastName: {
            type: Sequelize.STRING,
            field: 'last_name'
        },
        phoneNumber: {
            type: Sequelize.STRING,
            field: 'phone_number'
        }
    }, {
        timestamps: false,
        tableName: 'contact_info'
    }
)

ContactInfo.belongsTo(User);

module.exports = ContactInfo;