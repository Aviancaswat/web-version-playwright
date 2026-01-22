const passengerDefaultData = {
  passengerGenre: "male",
  passengerName: "Monitoreo",
  passengerLastName: "Digital",
  passengerBirthdate: "2000-12-25",
  passengerNationality: "CO",
  passengerFrequentFlyerProgram: "none",
};

const SEAT_LETTERS = ["A", "B", "C", "D", "E", "K"];

const generateSeat = (index: number) => {
  const row = Math.floor(index / SEAT_LETTERS.length) + 1;
  
  const letter = SEAT_LETTERS[index % SEAT_LETTERS.length];

  return { row: String(row), letter };
};

const passengerGroupList = (formData: Record<string, any>) => [
  { count: Number(formData.homePassengerAdults || 0), type: "Adulto" },
  { count: Number(formData.homePassengerYouths || 0), type: "Joven" },
  { count: Number(formData.homePassengerChildren || 0), type: "Niño" },
  { count: Number(formData.homePassengerInfant || 0), type: "Bebé" },
];

export const generatePassengerList = (formData: Record<string, any>) => {
  const passengerList: { id: string; title: string }[] = [];

  passengerGroupList(formData).forEach((group) => {
    for (let index = 1; index <= (Number(group.count) || 0); index++) {
      passengerList.push({
        id: `${group.type}-${index}`,
        title: `${group.type} ${index}`,
      });
    }
  });

  return passengerList;
};

export const generatePassengerDataByStep = (
  formData: Record<string, any>,
  targetStepKey: number[]
) => {
  const passengers = generatePassengerList(formData);

  const data: Record<string, any> = {};

  passengers.forEach((passenger, index) => {
    if (targetStepKey.length >= 4) {
      data[`${passenger.id}_passengerGenre`] =
        passengerDefaultData.passengerGenre;

      data[
        `${passenger.id}_passengerName`
      ] = `${passengerDefaultData.passengerName}`;

      data[`${passenger.id}_passengerLastName`] =
        passengerDefaultData.passengerLastName;

      data[`${passenger.id}_passengerBirthdate`] =
        passengerDefaultData.passengerBirthdate;

      data[`${passenger.id}_passengerNationality`] =
        passengerDefaultData.passengerNationality;

      data[`${passenger.id}_passengerFrequentFlyerProgram`] =
        passengerDefaultData.passengerFrequentFlyerProgram;
    }

    if (targetStepKey.length >= 6) {
      const seat = generateSeat(index);

      data[`${passenger.id}_seatNumberDeparture`] = seat.row;
      data[`${passenger.id}_seatLetterDeparture`] = seat.letter;

      if (formData.homeisActiveOptionOutbound === "false") {
        data[`${passenger.id}_seatNumberReturn`] = seat.row;
        data[`${passenger.id}_seatLetterReturn`] = seat.letter;
      }
    }
  });

  return data;
};
