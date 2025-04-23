import LayoutDefault from "../layout/LayoutDefault";
import Error404 from "../pages/Error404";
import Home from "../pages/Home";
import Room from "../pages/Room";
import Contact from "../pages/Contact";
import Introduce from "../pages/Introduce";
import Amenities from "../pages/Amenities";
import Logout from "../pages/Logout";
import Profile from "../pages/Profile";

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
                path: "/amenities",
                element: <Amenities />
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
        ],
    },
    {
        path: "*",
        element: <Error404 />
    },
];