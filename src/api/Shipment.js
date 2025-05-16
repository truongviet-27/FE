import Instance from "../axios/Instance";
export const getAllShipments = async () => {
    const url = `/api/v1/shipment/list`;
    return await Instance.get(url);
};
