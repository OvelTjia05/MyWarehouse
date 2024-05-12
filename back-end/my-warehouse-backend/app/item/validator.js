const Joi = require("joi");

const itemSchema = Joi.object({
  name: Joi.string().required(),
  qty: Joi.number().required(),
  picture: Joi.string(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  id_unit: Joi.string().required(),
});

const updateItemSchema = Joi.object({
  name: Joi.string(),
  qty: Joi.number(),
  picture: Joi.string(),
  description: Joi.string(),
  location: Joi.string(),
  id_unit: Joi.string(),
});

module.exports = {
  itemSchema,
  updateItemSchema,
};
