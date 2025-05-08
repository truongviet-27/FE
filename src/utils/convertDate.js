import moment from "moment";

export default function formatDate(isoString, includeTime = false) {
    const format = includeTime ? "DD/MM/YYYY - HH:mm:ss" : "DD/MM/YYYY";
    return moment(isoString).utcOffset(7).format(format);
}
