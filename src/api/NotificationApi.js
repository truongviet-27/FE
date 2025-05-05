import Instance from '../axios/Instance';

export const loadNotification = async () => {
    const url = `/api/v1/notification/load`;
    return await Instance.get(url);
}

export const readNotification = async (id) => {
    const url = `/api/v1/notification/read?id=${id}`;
    return await Instance.get(url);
}

export const pushNotification = async () => {
    const url = `/api/v1/notification/push`;
    return await Instance.get(url);
}