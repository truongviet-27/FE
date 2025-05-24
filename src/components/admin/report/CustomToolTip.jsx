const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            >
                <p>
                    <strong>Tháng:</strong> {label}
                </p>
                <p>
                    <strong>Tổng số đơn:</strong> {data?.order}
                </p>
                <p>
                    <strong>Tổng giá:</strong>{" "}
                    {data?.total?.toLocaleString("vi-VN")} VNĐ
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
