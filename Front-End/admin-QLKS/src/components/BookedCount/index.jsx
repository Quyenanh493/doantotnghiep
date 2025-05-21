import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { getBookedRoomCount } from "../../services/dashboardService";

const BookedCount = forwardRef(function BookedCount({ year }, ref) {
    const [dataBooked, setDataBooked] = useState(0);

    useImperativeHandle(ref, () => ({
        getData: () => {
            return {
                value: dataBooked
            };
        }
    }));

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getBookedRoomCount(year);
            setDataBooked(response);
        }
        fetchApi();
    }, [year])

    console.log("booked", dataBooked);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataBooked}</h2>
        </>
    )
});

export default BookedCount;