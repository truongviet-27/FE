const convertStatusOrder = (text) => {
    if (text === "PENDING_CONFIRM") {
        return <span className={`badge badge-secondary`}>Chờ xác nhận</span>;
    }
    if (text === "PROCESSING") {
        return <span className={`badge badge-primary`}>Đang xử lí</span>;
    }
    if (text === "SHIPPING") {
        return <span className={`badge badge-warning`}>Đang vận chuyển</span>;
    }
    if (text === "DELIVERED") {
        return <span className={`badge badge-success`}>Đã giao</span>;
    }
    if (text === "CANCELLED") {
        return <span className={`badge badge-danger`}>Hủy</span>;
    }
};

export default convertStatusOrder;
