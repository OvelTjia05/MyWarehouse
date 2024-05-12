const index = (req, res, next) => {
  res.json({
    message: 'Hello World',
  });
};

module.exports = {
  index,
};
