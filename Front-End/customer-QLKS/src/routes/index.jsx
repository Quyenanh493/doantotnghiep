import LayoutDefault from "../layout/LayoutDefault";
import Error404 from "../pages/Error404";
import Home from "../pages/Home";
import Room from "../pages/Room";
import Contact from "../pages/Contact";
import Introduce from "../pages/Introduce";
import Logout from "../pages/Logout";
import Profile from "../pages/Profile";
import RoomDetail from "../pages/RoomDetail";
import BookingConfirmation from "../pages/BookingConfirmation";
import BookingAmenities from "../pages/BookingAmenities";
import HistoryRoom from "../pages/HistoryRoom";
import ProtectedBookingRoute from "../components/ProtectedBookingRoute";

export const routes = [
    {
        path: "/",
        element: <LayoutDefault />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/room",
                element: <Room />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/introduce",
                element: <Introduce />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/logout",
                element: <Logout />
            },
            {
                path: "/room-detail/:roomId",
                element: <RoomDetail />
            },
            {
                path: "/booking-confirmation",
                element: <BookingConfirmation />
            },
            {
                path: "/booking-amenities",
                element: <ProtectedBookingRoute><BookingAmenities /></ProtectedBookingRoute>
            },
            {
                path: "/history-room",
                element: <HistoryRoom />
            },
        ],
    },
    {
        path: "*",
        element: <Error404 />
    },
];