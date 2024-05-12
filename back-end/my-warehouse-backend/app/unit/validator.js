const Joi = require('joi');

const unitSchema = Joi.object({
  name: Joi.string().required(),
});

module.exports = {
  unitSchema,
};
