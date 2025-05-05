import Instance from "../axios/Instance";

export const getAttribute = async (id, size) => {
    const url = `/api/v1/attribute/get-by-product?productId=${id}&size=${size}`;
    return await Instance.get(url);
}

export const getAttributeById = async (id) => {
    const url = `/api/v1/attribute?id=${id}`;
    return await Instance.get(url);
}