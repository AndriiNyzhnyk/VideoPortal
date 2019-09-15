'use strict';

const self = module.exports = {
    validate: async (decoded, req) => {
        console.log(decoded, req);
        let user = await User.findOne({ _id: decoded.id });
        if (user) {
            req.user = user;
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    }
};