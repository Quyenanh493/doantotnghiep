import express from "express";
import authRoutes from "./auth.routes";
import roomRoutes from "./room.routes";
import amenitiesRoutes from "./amenities.routes";
import roomAvailabilityRoutes from "./roomAvailability.routes";
import customerRoutes from "./customer.routes";
import uploadRoutes from "./upload.routes";
import paymentRoutes from "./payment.routes";
import contactRoutes from "./contact.routes";
import hotelRoutes from "./hotelRoute";
import factBookingRoutes from "./factBooking.routes";
import factBookingDetailRoutes from "./factBookingDetail.routes";
import accountRoutes from "./account.routes";
import userRoutes from "./user.routes";
import roleRoutes from "./role.routes";

const router = express.Router();

let initApiRoutes = (app) => {
  router.use('/auth', authRoutes);
  router.use('/rooms', roomRoutes);
  router.use('/amenities', amenitiesRoutes);
  router.use('/room-availabilities', roomAvailabilityRoutes);
  router.use('/customers', customerRoutes);
  router.use('/upload-image', uploadRoutes);
  router.use('/payment', paymentRoutes);
  router.use('/contact', contactRoutes);
  router.use('/hotel', hotelRoutes);
  router.use('/bookings', factBookingRoutes);
  router.use('/booking-details', factBookingDetailRoutes);
  router.use('/accounts', accountRoutes);
  router.use('/users', userRoutes);
  router.use('/roles', roleRoutes);

  return app.use("/api/v1/", router);
}

export default initApiRoutes;