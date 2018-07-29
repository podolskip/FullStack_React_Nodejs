const validator = require('validator');
const isEmpty = require('./is_empty');


module.exports = function validateRegisterInput(data) {
    let errors = {};
    let lengthIsValid = !validator.isLength(data.name, { min: 2, max: 30 });

    if (lengthIsValid) {
        errors.name = 'Name ust be between 2 and 30 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
} 