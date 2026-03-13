import express from "express";
import {
  searchCompanies,
  createCompany,
  getCompaniesWithReferrers,
  getCompanyById,
} from "../controllers/company.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/search", searchCompanies);
router.get("/", getCompaniesWithReferrers);
router.get("/:id", getCompanyById);

router.post("/", protect, createCompany);

export default router;
