const express = require("express");
const path = require("path");
const { getClassmates, getTerms } = require("./app");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

app.get("/api/terms", async (req, res) => {
  try {
    const terms = await getTerms();
    res.json(terms);
  } catch (error) {
    console.error("Terms route error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/classmates", async (req, res) => {
  const searchQuery = (req.body.searchQuery || "").toString();

  try {
    const classmates = await getClassmates(searchQuery);
    res.json(classmates);
  } catch (error) {
    console.error("Error in /api/classmates:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
