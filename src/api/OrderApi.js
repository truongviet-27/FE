import Instance from "../axios/Instance";
export const createOrder = async (data) => {
    const url = `/api/v1/order/create`;
    return await Instance.post(url, data);
};

export const getOrderById = async (id) => {
    const url = `/api/v1/order?id=${id}`;
    return await Instance.get(url);
};

export const getOrderDetailByOrderId = async (id) => {
    const url = `/api/v1/order/order-detail?orderId=${id}`;
    return await Instance.get(url);
};

export const getAllOrderStatus = async () => {
    const url = `/api/v1/order/order-status`;
    return await Instance.get(url);
};

export const getAllOrder = async (id, status, page, size) => {
    const url = `/api/v1/order/list?accountId=${id}&statusCode=${status}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const cancelOrder = async (data) => {
    const url = `/api/v1/order/cancel`;
    return await Instance.post(url, data);
};

export const updateOrderReturn = async (data) => {
    const url = `/api/v1/order/update-order-return`;
    return await Instance.post(url, data);
};

export const updateOrderRefund = async (data) => {
    const url = `/api/v1/order/update-order-refund`;
    return await Instance.post(url, data);
};

//admin
export const countOrderByCategoryName = async () => {
    const url = `/api/v1/order/list/category-count`;
    return await Instance.get(url);
};

export const countOrder = async () => {
    const url = `/api/v1/order/count`;
    return await Instance.get(url);
};

export const reportAmountYear = async () => {
    const url = `/api/v1/order/synthesis/year`;
    return await Instance.get(url);
};

export const amountYear = async () => {
    const url = `/api/v1/order/synthesis/amount-year`;
    return await Instance.get(url);
};

export const reportByProduct = async (page, size, sort) => {
    const url = `/api/v1/order/synthesis/product?page=${page}&size=${size}&sort=${sort}`;
    return await Instance.get(url);
};

export const getOrderByOrderStatusAndYearAndMonth = async (
    status,
    payment,
    year,
    month,
    page,
    size
) => {
    const url = `/api/v1/order/synthesis/order-by-year-month?status=${status}&payment=${payment}&year=${year}&month=${month}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const getOrderByOrderYearAndMonth = async (
    year,
    month,
    statusCode,
    page,
    size
) => {
    const url = `/api/v1/order/synthesis/order-year-month?year=${year}&month=${month}&statusCode=${statusCode}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const getOrderByProduct = async (id, page, size) => {
    const url = `/api/v1/order/synthesis/order-by-product?id=${id}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const reportAmountMonth = async (year) => {
    const url = `/api/v1/order/synthesis/amount-month?year=${year}`;
    return await Instance.get(url);
};
export const updateOrder = async (data) => {
    const url = `/api/v1/order/update`;
    return await Instance.post(url, data);
};
export const updateCancel = async (data) => {
    const url = `/api/v1/order/admin/cancel-order`;
    return await Instance.post(url, data);
};

export const updateProcess = async (data) => {
    const url = `/api/v1/order/admin/update-process`;
    return await Instance.post(url, data);
};
export const updateShip = async (data) => {
    const url = `/api/v1/order/admin/update-shipment`;
    return await Instance.post(url, data);
};

export const updateSuccess = async (data) => {
    const url = `/api/v1/order/admin/update-success`;
    return await Instance.post(url, data);
};

export const getAllOrderAndPagination = async (
    status,
    payment,
    from,
    to,
    page,
    size
) => {
    const url = `/api/v1/order/page-admin?page=${page}&size=${size}&status=${status}&payment=${payment}&from=${from}&to=${to}`;
    return await Instance.get(url);
};
export const getOrderByOrderStatusBetweenDate = async (
    status,
    from,
    to,
    page,
    size
) => {
    const url = `/api/v1/order/admin/page-orders-between-date?id=${status}&from=${from}&to=${to}&page=${page}&size=${size}`;
    return await Instance.get(url);
};
export const getAllOrdersByPayment = async (paymentMethod, page, size) => {
    const url = `/api/v1/order/payment?page=${page}&size=${size}&payment=${paymentMethod}`;
    return await Instance.get(url);
};
