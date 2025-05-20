import { useEffect, useState } from "react";
import { getRevenueByHotel } from "../../services/dashboardService";
import { Pie } from "@ant-design/charts"

function HotelPie() {
    const [dataPie, setDataPie] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const response = await getRevenueByHotel("2025");
            setDataPie(response);
        }
        fetchApi();
    }, []);
    const config = {
        data: dataPie,
        angleField: "totalRevenue",
        colorField: "hotelName",
        label: {
            type: 'spider',
            formatter: (datum) => `${datum.hotelName}\n${datum.totalRevenue ? datum.totalRevenue.toLocaleString() : 0} VNĐ`,
        },
        tooltip: {
            formatter: (datum) => ({
                name: datum.hotelName,
                value: (datum.totalRevenue ? datum.totalRevenue.toLocaleString() : 0) + ' VNĐ'
            })
        },
        legend: { position: 'right' },
        radius: 1,
        appendPadding: 10,
    }
    console.log("hotel", dataPie);

    return (
        <>
            <h1>Biểu đồ số tiền kiếm được của mỗi khách sạn 2025</h1>
            <Pie {...config} />
        </>
    )
}

export default HotelPie;