import { useEffect, useState } from "react";
import { getTotalRevenue } from "../../services/dashboardService";

function Revenue() {
    const [dataRev, setDataRev] = useState();
    
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getTotalRevenue();
            // console.log(response);
            setDataRev(response);
        }
        fetchApi();
    }, []);

    console.log("revenue", dataRev);
    return (
        <>
            <h2 style={{ color: '#2db7f5' }}>{dataRev} VNĐ</h2>
        </>
    )
}

export default Revenue;