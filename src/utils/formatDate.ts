export const formatDate = (dateString: string, typeFormat: string) => {
  if (!dateString) return "";

  if (typeFormat === "mm-dd") {
    const [, month, day] = dateString.toString().split("-");

    const months = [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ];

    return `${months[Number(month) - 1]} ${Number(day)} `;
  }

  if (typeFormat === "yyyy-mm-dd") {
    const months: Record<string, string> = {
      ene: "01",
      feb: "02",
      mar: "03",
      abr: "04",
      may: "05",
      jun: "06",
      jul: "07",
      ago: "08",
      sep: "09",
      oct: "10",
      nov: "11",
      dic: "12",
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
