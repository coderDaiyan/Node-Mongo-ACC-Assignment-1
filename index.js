const app = require("express")();
const colors = require("colors");
const erouter = require("express-dynamic-routing");
const path = require("path");

const PORT = 8080;
const dir_path = path.join(__dirname, "routes");

app.use(require("express").json());
erouter({
  prefix: "/api/v1/",
  app: app,
  folder: dir_path,
  middlewares: [],
  disableWarnings: false,
});

app.get("/", (req, res) => {
  res.send("Welcome to Random User API");
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`App is listening on PORT ${PORT}`.green);
});
