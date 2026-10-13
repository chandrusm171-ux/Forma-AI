const express = require("express");
const healthRoutes = require("./healthRoutes");
const formRoutes = require("./formRoutes");
const submissionRoutes = require("./submissionRoutes");
const aiRoutes = require("./aiRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/forms", formRoutes);
router.use("/submissions", submissionRoutes);
router.use("/ai", aiRoutes);

module.exports = router;
