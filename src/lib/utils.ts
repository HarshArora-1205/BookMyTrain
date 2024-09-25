export const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    console.log(date.toLocaleString());
    return date
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        .replace(",", "")
        .replace(":", "-");
};