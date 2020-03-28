const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const port = 3333;

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
