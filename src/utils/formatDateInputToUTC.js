const formatDateInputToUTC = (dateStr) => {
    if (!dateStr) return null;

    const [year, month, day] = dateStr.split("-").map((v) => parseInt(v, 10));

    if (!year || !month || !day) return null;

    // Tạo đối tượng Date với giờ UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    return utcDate.toISOString(); // Kết quả: "1995-05-13T00:00:00.000Z"
};
export default formatDateInputToUTC;
