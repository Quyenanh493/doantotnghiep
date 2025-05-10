import LayoutDefault from "../layout/LayoutDefault";
import Error404 from "../pages/Error404";
import Home from "../pages/Home";
import Categories from "../pages/Categories";
import Customers from "../pages/Customers";
import Rooms from "../pages/Rooms";
import Bookings from "../pages/Bookings";

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
                path: "/categories",
                element: <Categories />
            },
            {
                path: "/customers",
                element: <Customers />
            },
            {
                path: "/rooms",
                element: <Rooms />
            },
            {
                path: "/bookings",
                element: <Bookings />
            },
        ],
    },
    {
        path: "*",
        element: <Error404 />
    },
];