const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const matchRoutes = require("./routes/match.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/match", matchRoutes);

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
