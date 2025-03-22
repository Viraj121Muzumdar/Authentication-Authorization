const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
