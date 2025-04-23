import { useNavigate } from "react-router-dom";
import { deleteAllCookies } from "../../helpers/cookie";
import { useEffect } from "react";

function Logout() {
    const navigate = useNavigate();
    deleteAllCookies();

    useEffect(() => {
        navigate("/login")
    }, [])
    return (
        <> 
        </>
    )
}

export default Logout;