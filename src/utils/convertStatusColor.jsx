const convertStatusColor = (text) => {
    if (text === "PENDING_CONFIRM") {
        return <span className={`text-[#349eff] font-bold`}>Chờ xác nhận</span>;
    }
    if (text === "PROCESSING") {
        return <span className={`text-purple font-bold`}>Đang xử lí</span>;
    }
    if (text === "SHIPPING") {
        return (
            <span className={`text-[#d68102] font-bold`}>Đang vận chuyển</span>
        );
    }
    if (text === "DELIVERED") {
        return <span className={`text-[#019707] font-bold`}>Đã giao</span>;
    }
    if (text === "CANCELLED") {
        return <span className={`text-[#fb0b12] font-bold`}>Hủy</span>;
    }
};

export default convertStatusColor;
