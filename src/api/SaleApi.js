import Instance from "../axios/Instance";

export const getSale = async (page, size, query, search) => {
    const url = `/api/v1/sale/list?page=${page}&size=${size}&query=${query}&search=${search}`;
    return await Instance.get(url);
};

export const createSale = async (data) => {
    const url = `/api/v1/sale/create`;
    return await Instance.post(url, data);
};

export const getSaleDetail = async (id) => {
    const url = `/api/v1/sale/detail?id=${id}`;
    return await Instance.get(url);
};
export const updateSale = async (data) => {
    const url = `/api/v1/sale/update`;
    return await Instance.put(url, data);
};
