import Instance from "../axios/Instance";

export const getAttribute = async (id, size) => {
    const url = `/api/v1/attribute/get-by-product?productId=${id}&size=${size}`;
    return await Instance.get(url);
};

export const getAttributeById = async (id) => {
    const url = `/api/v1/attribute?id=${id}`;
    return await Instance.get(url);
};

export const getAllReviewAttributeByProductId = async (id, page, size) => {
    const url = `/api/v1/attribute/review?productId=${id}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const getReviewAttributeByOrderDetailId = async (id) => {
    const url = `/api/v1/attribute/review-detail?orderDetailId=${id}`;
    return await Instance.get(url);
};

export const reviewProduct = async (data) => {
    const url = `/api/v1/attribute/review`;
    return await Instance.post(url, data);
};
