const express = require("express");
const path = require("path");
const { getClassmates } = require("./app");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// API endpoint for HTML input
app.post("/api/classmates", async (req, res) => {
  const { termYearCode } = req.body;
  const termCodeStr = termYearCode?.toString() || "";
  const classmates = await getClassmates(termCodeStr);

  try {
    const classmates = await getClassmates(termYearCode);
    res.json(classmates);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
