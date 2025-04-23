import express from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";
import amenitiesRoutes from "./amenities.routes";
import roomAvailabilityRoutes from "./roomAvailability.routes";
import customerRoutes from "./customer.routes";
import uploadRoutes from "./upload.routes";

const router = express.Router();

let initApiRoutes = (app) => {
  router.use('/auth', authRoutes);
  router.use('/rooms', roomRoutes);
  router.use('/amenities', amenitiesRoutes);
  router.use('/room-availabilities', roomAvailabilityRoutes);
  router.use('/customers', customerRoutes);
  router.use('/upload-image', uploadRoutes);

  return app.use("/api/v1/", router);
}

export default initApiRoutes;