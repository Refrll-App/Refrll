import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const profileUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  currentCompanyId: Joi.string().hex().length(24).allow("", null),
  skills: Joi.array().items(Joi.string().trim().max(50)),
  experience: Joi.number().min(0).max(60),
  bio: Joi.string().max(1000).allow(""),
  linkedIn: Joi.string().uri().allow("").optional(),
});

export const applicationSchema = Joi.object({
  companyId: Joi.string().hex().length(24).required(),
  jobId: Joi.string().trim().required(),
  message: Joi.string().min(50).max(2000).required(),
});

export const companyCreateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  type: Joi.string().valid("company", "hr_firm", "consultancy").default("company"),
  industry: Joi.string().trim().max(100).allow(""),
  website: Joi.string().uri().allow("").optional(),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(100).required(),
});

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ message });
  }
  next();
};
