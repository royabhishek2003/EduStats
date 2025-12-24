const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const signupRouter = require("./routes/signup.js");
const loginRouter = require("./routes/login.js");
const homeRouter = require('./routes/home.js');
const logoutRouter = require('./routes/logout.js')
const manualEntryRoute = require('./routes/manual-entry.js')
const uploadExcelRoute = require("./routes/uploadExcel.js");
const dashboardRoute = require('./routes/dashboard.js')
const savedResultsRoute = require('./routes/saved-results.js');
const deleteVizRoute = require('./routes/deleteViz.js');
const contactRoute = require("./routes/contact");
const profileroute= require("./routes/Profile.js");
// const aiRoute = require('./routes/ai.js');
dotenv.config();
connectDB();
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/signup", signupRouter);
app.use("/api/login", loginRouter);
app.use('/api/home', homeRouter);
app.use('/api/logout',logoutRouter);
app.use('/api/manual-entry',manualEntryRoute);
app.use("/api/uploadExcel", uploadExcelRoute);
app.use("/api/visuals", dashboardRoute);
app.use("/api/saved-results", savedResultsRoute);
app.use("/api/deleteViz", deleteVizRoute);
// app.use("/api/ai", aiRoute);
app.use("/api/contact", contactRoute);
app.use("/api/profile",profileroute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
