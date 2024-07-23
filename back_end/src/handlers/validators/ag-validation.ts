import Joi from 'joi';

export const createAGValidation = Joi.object({
  title: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  agenda: Joi.string().required(),
  emails: Joi.array().items(Joi.string().email()).required(),
  link: Joi.string().uri().optional()
});