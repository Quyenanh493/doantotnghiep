import { useEffect, useState } from "react";
import { getBookedRoomCount } from "../../services/dashboardService";

function BookedCount() {
    const [dataBooked, setDataBooked] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getBookedRoomCount();
            setDataBooked(response);
        }
        fetchApi();
    }, [])

    console.log("booked", dataBooked);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataBooked}</h2>
        </>
    )
}

export default BookedCount;