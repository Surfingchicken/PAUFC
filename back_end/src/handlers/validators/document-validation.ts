import Joi from 'joi';

export interface documentCreateValidationRequest {
  title: string;
  description: string;
  category: string;   
  file: any;
}

export const documentCreateValidation = Joi.object<documentCreateValidationRequest>({
  title: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(), 
  file: Joi.any().required()
});

export interface documentListValidationRequest {
  page: number;
  result: number;
  category?: string;
  year?: number;
}

export const documentListValidation = Joi.object<documentListValidationRequest>({
  page: Joi.number().min(1).optional(),
  result: Joi.number().min(1).optional(),
  category: Joi.string().optional(),
  year: Joi.number().optional()
});

export const getCategoryValidation = Joi.object({});

export const getYearsValidation = Joi.object({
  category: Joi.string().required()
});
