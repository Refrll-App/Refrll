import Company from "../models/Company.model.js";
import ReferrerProfile from "../models/ReferrerProfile.model.js";
import { createError } from "../middleware/error.middleware.js";

export const searchCompanies = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q || q.length < 1) return res.json({ companies: [] });

    const normalizedQ = Company.normalize(q);

    let companies = await Company.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(8)
      .lean();

    if (!companies.length) {
      companies = await Company.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { aliases: { $regex: normalizedQ, $options: "i" } },
        ],
      })
        .limit(8)
        .lean();
    }

    res.json({ companies });
  } catch (err) {
    next(err);
  }
};

export const createCompany = async (req, res, next) => {
  try {
    const { name, type = "company", industry = "", website = "" } = req.body;

    if (!name || name.trim().length < 2) {
      return next(createError(400, "Company name must be at least 2 characters"));
    }

    const trimmedName = name.trim();
    const slug = Company.generateSlug(trimmedName);
    const normalizedAlias = Company.normalize(trimmedName);

    const existing = await Company.findOne({
      $or: [
        { slug },
        { aliases: normalizedAlias },
        { name: { $regex: new RegExp(`^${trimmedName}$`, "i") } },
      ],
    });

    if (existing) {
      return res.status(200).json({ company: existing, existed: true });
    }

    const company = await Company.create({
      name: trimmedName,
      slug,
      aliases: [normalizedAlias],
      type,
      industry,
      website,
      createdBy: req.user._id,
    });

    res.status(201).json({ company, existed: false });
  } catch (err) {
    next(err);
  }
};

export const getCompaniesWithReferrers = async (req, res, next) => {
  try {
    const results = await ReferrerProfile.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$companyId",
          referrerCount: { $sum: 1 },
        },
      },
      { $sort: { referrerCount: -1 } },
      {
        $lookup: {
          from: "companies",
          localField: "_id",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: 0,
          companyId: "$_id",
          referrerCount: 1,
          "company._id": 1,
          "company.name": 1,
          "company.slug": 1,
          "company.type": 1,
          "company.industry": 1,
          "company.logoUrl": 1,
          "company.isVerified": 1,
        },
      },
    ]);

    res.json({ companies: results });
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return next(createError(404, "Company not found"));
    res.json({ company });
  } catch (err) {
    next(err);
  }
};
