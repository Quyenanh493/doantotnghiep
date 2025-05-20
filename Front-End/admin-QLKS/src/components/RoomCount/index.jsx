import { useEffect, useState } from "react";
import { getRoomCount } from "../../services/dashboardService";
function RoomCount() {
    const [dataRoom, setDataRoom] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getRoomCount();
            setDataRoom(response);
        }
        fetchApi();
    }, [])

    console.log("room", dataRoom);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataRoom}</h2>
        </>
    )
}

export default RoomCount;