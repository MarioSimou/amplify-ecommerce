const joi = require("joi");

const putBodySchema = joi.object({
  name: joi.string(),
  description: joi.string(),
  price: joi.number().min(0.01),
});

const postBodySchema = joi.object({
  name: joi.string().required(),
  description: joi.string(),
  price: joi.number().required().min(0.01),
});

const guidParamsSchema = joi.object({
  guid: joi.string().required().uuid(),
});

module.exports = {
  putBodySchema,
  postBodySchema,
  guidParamsSchema,
};
