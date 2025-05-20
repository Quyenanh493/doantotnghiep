import { useEffect, useState } from "react";
import { getCustomerRegisterByMonth } from "../../services/dashboardService";
import { Area } from "@ant-design/charts";

function CustomerArea() {
    const [dataCustomer, setDataCustomer] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            const response = await getCustomerRegisterByMonth("2025");
            // console.log(response);
            setDataCustomer(response);
        }
        fetchApi();
    }, []);

    console.log("customer", dataCustomer);
    
    const config = {
        data: dataCustomer,
        xField: "month",
        yField: "count",
        smooth: true,
        point: true,
        slider: {
            start: 0,
            end: 1
        }
    }
    return (
        <>
            <h1>Biểu đồ khách hàng đăng kí năm 2025</h1>
            <Area {...config} />
        </>
    )
}

export default CustomerArea;