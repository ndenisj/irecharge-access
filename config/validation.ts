import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production'),
  PORT: Joi.number().default(3000),
  POSTGRES_URI: Joi.string().required(),
  POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
  
});
