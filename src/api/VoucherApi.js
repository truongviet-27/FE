import Instance from "../axios/Instance";

export const getVoucherByCode = async (code) => {
    const url = `/api/v1/voucher/by-code?code=${code}`;
    return await Instance.get(url);
};

export const getVouchers = async (page, size, query, search) => {
    const url = `/api/v1/voucher/list?page=${page}&size=${size}&query=${query}&search=${search}`;
    return await Instance.get(url);
};
export const createVoucher = async (data) => {
    const url = `/api/v1/voucher/create`;
    return await Instance.post(url, data);
};
export const getVoucherDetail = async (id) => {
    const url = `/api/v1/voucher/detail?id=${id}`;
    return await Instance.get(url);
};
export const updateVoucher = async (data) => {
    const url = `/api/v1/voucher/update`;
    return await Instance.put(url, data);
};
