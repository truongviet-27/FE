import Instance from "../axios/Instance";
export const getBrands = async (page, size) => {
    const url = `/api/v1/brand/list?page=${page}&size=${size}`;
    return await Instance.get(url);
}
export const createBrand = async (data) => {
    const url = `/api/v1/brand/create`;
    return await Instance.post(url, data);
}

export const getBrandDetail = async (id) => {
    const url = `/api/v1/brand/detail?id=${id}`;
    return await Instance.get(url);
}
export const updateBrand = async (data) => {
    const url = `/api/v1/brand/update`;
    return await Instance.put(url, data);
}
