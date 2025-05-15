import Instance from "../axios/Instance";

export const getAllProducts = async (page, size, active, userId) => {
    const url = `/api/v1/product/get-all?page=${page}&size=${size}&isActive=${active}&userId=${userId}`;
    const response = await Instance.get(url);
    return response;
};
export const getAllProductWishList = async (token, page, size) => {
    const url = `/api/v1/product/wish-list?page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const toggleLikeProduct = async (productId, likeStatus, token) => {
    return await Instance.put(
        `/api/v1/product/like?productId=${productId}&liked=${likeStatus}`
    );
};

export const filterProducts = async (data) => {
    const url = `/api/v1/product/get-all/filter`;
    return await Instance.post(url, data);
};

export const getProductById = async (id) => {
    const url = `/api/v1/product/${id}`;
    return await Instance.get(url);
};

export const relateProduct = async (page, size, id, brandId, userId) => {
    const url = `/api/v1/product/relate?brandId=${brandId}&id=${id}&userId=${userId}&page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const getRecommendation = async (id) => {
    const url = `/api/v1/product/recommendation?id=${id}&page=0&size=3`;
    return await Instance.get(url);
};

export const getListHot = async () => {
    const url = `/api/v1/product/list/hot?page=0&size=10`;
    return await Instance.get(url);
};

export const searchByKeyword = async (page, size, keyword) => {
    const url = `/api/v1/product/search?page=${page}&size=${size}&search=${keyword}`;
    return await Instance.get(url);
};

export const countProduct = async () => {
    const url = `/api/v1/product/count`;
    return await Instance.get(url);
};

export const getAllProductsByBrand = async (
    brand,
    page,
    size,
    query,
    search
) => {
    const url = `/api/v1/product/by-brand?brandId=${brand}&page=${page}&size=${size}&query=${query}&search=${search}`;
    return await Instance.get(url);
};

export const createProduct = async (formData) => {
    const url = `/api/v1/product/create`;
    return await Instance.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const modifyProduct = async (formData) => {
    const url = `/api/v1/product/modify`;
    return await Instance.put(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// export const modifyProduct = async (data) => {
//     const url = `/api/v1/product/modify`;
//     return await Instance.put(url, data);
// }
