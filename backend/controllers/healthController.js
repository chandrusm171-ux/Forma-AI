const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Forma-AI backend is healthy"
  });
};

module.exports = healthCheck;