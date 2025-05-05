import Instance from "../axios/Instance";

export const getInformation = async (token) => {
    const url = `/api/v1/user/detail`;
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    return await Instance.get(url, { headers });
};

export const getAccountDetailByAccountId = async (id) => {
    const url = `/api/v1/user/${id}`;
    return await Instance.get(url);
};

export const countAccount = async () => {
    const url = `/api/v1/user/admin/count`;
    return await Instance.get(url);
};

export const getTotalPage = async () => {
    const url = `/api/v1/user/admin/total-page`;
    return await Instance.get(url);
};

export const getAccountByRole = async (page, size, role) => {
    const url = `/api/v1/user/admin/account/by-role?page=${page}&size=${size}&roleName=${role}`;
    return await Instance.get(url);
};

export const getAccounts = async (page, size) => {
    const url = `/api/v1/user/admin/account/find-all?page=${page}&size=${size}`;
    return await Instance.get(url);
};

export const createAccount = async (data) => {
    const url = `/api/v1/user/admin/create`;
    return await Instance.post(url, data);
};

export const updateAccount = async (data) => {
    const url = `/api/v1/user/update-profile`;
    return await Instance.put(url, data);
};
