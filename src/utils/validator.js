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
}
export default Validator;