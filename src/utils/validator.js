import Joi from '@hapi/joi';

class Validator {
  static validateRegister(account) {
    return Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .regex(new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})"))
        .error(new Error("Password is in incorrect format"))
        .required()
    }).validate(account);
  }
  static validateProfile(account) {
    return Joi.object({
      id: Joi.string().required(),
      name: Joi.string().required(),
      gender: Joi.string().required(),
      dob: Joi.string().required(),
      address: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      isActive: Joi.string().required()
    }).validate(account);
  }
}
export default Validator;