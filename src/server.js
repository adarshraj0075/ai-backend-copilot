require("dotenv").config();

const express = require("express");
const logger = require("./middleware/logger");
const limiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(express.json());
app.use(logger);
app.use(limiter);

app.use("/api", aiRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});