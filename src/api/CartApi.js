import Instance from "../axios/Instance";

export const modifyCartItem = async (data) => {
    const url = `/api/v1/cart/modify`;
    return await Instance.post(url, data);
}


export const isEnoughCartItem = async (id, quantity) => {
    const url = `/api/v1/cart/check-stock?id=${id}&quantity=${quantity}`;
    return await Instance.get(url);
}

export const getCartItemByAccountId = async (id) => {
    const url = `/api/v1/cart/by-account?id=${id}`;
    return await Instance.get(url);
}

export const removeCartItem = async (data) => {
    const url = `/api/v1/cart/remove`;
    return await Instance.post(url, data);
}