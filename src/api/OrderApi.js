import Instance from "../axios/Instance";
export const createOrder = async (data) => {
    const url = `/api/v1/order/create`;
    return await Instance.post(url, data);
}

export const getOrderById = async (id) => {
    const url = `/api/v1/order?id=${id}`;
    return await Instance.get(url);
}

export const getOrderDetailByOrderId = async (id) => {
    const url = `/api/v1/order/order-detail?orderId=${id}`;
    return await Instance.get(url);
}

export const getAllOrderStatus = async () => {
    const url = `/api/v1/order/order-status`;
    return await Instance.get(url);
}

export const getAllOrder = async (id, status, page, size) => {
    const url = `/api/v1/order/list?accountId=${id}&orderStatusId=${status}&page=${page}&size=${size}`;
    return await Instance.get(url);
}

export const cancelOrder = async (data) => {
    const url = `/api/v1/order/cancel`;
    return await Instance.post(url, data);
}

//admin
export const countOrderByName = async () => {
    const url = `/api/v1/order/list/count`;
    return await Instance.get(url);
}

export const countOrder = async () => {
    const url = `/api/v1/order/count`;
    return await Instance.get(url);
}

export const reportAmountYear = async () => {
    const url = `/api/v1/order/synthesis/year`;
    return await Instance.get(url);
}

export const reportByProduct = async (page, size) => {
    const url = `/api/v1/order/synthesis/product?page=${page}&size=${size}`;
    return await Instance.get(url);
}

export const getOrderByOrderStatusAndYearAndMonth = async (status, year, month, page, size) => {
    const url = `/api/v1/order/synthesis/order-by-year-month?id=${status}&year=${year}&month=${month}&page=${page}&size=${size}`;
    return await Instance.get(url);
}

export const getOrderByProduct = async (id, page, size) => {
    const url = `/api/v1/order/synthesis/order-by-product?id=${id}&page=${page}&size=${size}`;
    return await Instance.get(url);
}

export const reportAmountMonth = async (year) => {
    const url = `/api/v1/order/synthesis/amount-month?year=${year}`;
    return await Instance.get(url);
}
export const updateOrder = async (data) => {
    const url = `/api/v1/order/update`;
    return await Instance.post(url, data);
}
export const updateCancel = async (data) => {
    const url = `/api/v1/order/admin/cancel-order`;
    return await Instance.post(url, data);
}

export const updateProcess = async (data) => {
    const url = `/api/v1/order/admin/update-process`;
    return await Instance.post(url, data);
}
export const updateShip = async (data) => {
    const url = `/api/v1/order/admin/update-shipment`;
    return await Instance.post(url, data);
}

export const updateSuccess = async (data) => {
    const url = `/api/v1/order/admin/update-success`;
    return await Instance.post(url, data);
}

export const getAllOrderAndPagination = async (status, payment, page, size) => {
    const url = `/api/v1/order/page-admin?page=${page}&size=${size}&status=${status}&payment=${payment}`;
    return await Instance.get(url);
}
export const getOrderByOrderStatusBetweenDate = async (status, from, to, page, size) => {
    const url = `/api/v1/order/admin/page-orders-between-date?id=${status}&from=${from}&to=${to}&page=${page}&size=${size}`;
    return await Instance.get(url);
}
export const getAllOrdersByPayment = async (paymentMethod, page, size) => {
    const url = `/api/v1/order/payment?page=${page}&size=${size}&payment=${paymentMethod}`;
    return await Instance.get(url);
}