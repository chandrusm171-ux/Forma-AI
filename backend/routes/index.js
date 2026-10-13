

const express = require("express");
const healthRoutes = require("./healthRoutes");
const formRoutes = require("./formRoutes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/forms", formRoutes);

module.exports = router;
