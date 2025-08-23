import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().isString().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('linkedinUrl').optional().isURL(),
  body('githubUrl').optional().isURL(),
  body('website').optional().isURL(),
  body('location').optional().isString(),
  body('designation').optional().isString(),
  body('yearsOfExp').optional().isNumeric(),
  body('skills').optional().isArray(),
  body('avatarUrl').optional().isURL(),
  body('resumeUrl').optional().isURL(),
  body('companyName').optional().isString().trim(),
];
