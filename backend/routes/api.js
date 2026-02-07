const express = require('express');
const router = express.Router();

router.get('/shifts', (req, res) => {
  res.json([{ id: 1, name: "Morning Shift" }, { id: 2, name: "Evening Shift" }]);
});

module.exports = router;
