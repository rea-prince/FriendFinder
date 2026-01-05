const express = require("express");
const path = require("path");
const { getClassmates } = require("./app");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

// API endpoint for HTML input
app.post("/api/classmates", async (req, res) => {
  const searchQuery = (req.body.searchQuery || "").toString();

  try {
    const classmates = await getClassmates(searchQuery);
    res.json(classmates);
  } catch (e) {
    console.error("Error in /api/classmates:", e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
