const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperirnceInput(data) {
  const errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'Schoold is required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree is required';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
