import express from "express";
import userController from "../controllers/testController.js";

let router = express.Router();

let initWebRoutes = (app) => {
  // router.get("/", (req, res) => {
  //   return res.send("Hello World with quyen");
  // })

  router.post('/api/login', userController.handleLogin);

  return app.use("/", router);
}

module.exports = initWebRoutes;