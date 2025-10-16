export const formatDate = (dateString: string, typeFormat: string) => {
  if (!dateString) return "";

  if (typeFormat === "mm-dd") {
    const [, month, day] = dateString.toString().split("-");

    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    return `${months[Number(month) - 1]} ${Number(day)} `;
  }

  if (typeFormat === "yyyy-mm-dd") {
    const months: Record<string, string> = {
      jan: "01",
      feb: "02",
      mar: "03",
      apr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      aug: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dec: "12",
    };

    const [mon, dayStr] = (dateString as string).split(" ");
    const day = String(dayStr).padStart(2, "0");
    const today = new Date();
    const year = today.getFullYear();

    let candidate = new Date(`${year}-${months[mon.toLowerCase()]}-${day}`);

    if (candidate < today) {
      candidate.setFullYear(year + 1);
    }

    return candidate.toISOString().split("T")[0];
  }
};
