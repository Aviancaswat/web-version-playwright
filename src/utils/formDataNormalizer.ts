//Utils
import { formatDate } from "./formatDate";

//Types
import type { FormDataNormalizerParams } from "./formDataNormalizer.types";

export const formDataNormalizer = ({
  data,
  stepFields,
  type,
}: FormDataNormalizerParams) => {
  const result = { ...data };

  switch (type) {
    case "new":
      Object.keys(data).forEach((key) => {
        const value = result[key];
        if (value === "true") result[key] = true;
        else if (value === "false") result[key] = false;
      });

      stepFields.forEach((step) => {
        step.input.forEach((field) => {
          if (result[field.name] === undefined || result[field.name] === null)
            return;

          if (field.type === "date") {
            result[field.name] = formatDate(result[field.name], "mm-dd") ?? "";
          } else if (
            field.name === "bookingNumeroVueloIda" ||
            field.name === "bookingNumeroVueloRegreso"
          ) {
            result[field.name] = String(result[field.name]);
          } else if (field.type === "number") {
            const num = Number(result[field.name]);
            if (!isNaN(num)) result[field.name] = num;
          }
        });
      });

      const passengerMap: Record<string, any> = {};

      Object.entries(result).forEach(([key, value]) => {
        const match = key.match(/^(.+?)_(passenger.+)$/);

        if (!match) return;

        const passengerType = match[1];
        const passengerField = match[2];

        if (!passengerMap[passengerType]) {
          passengerMap[passengerType] = { passengerType };
        }

        passengerMap[passengerType][passengerField] = value;

        delete result[key];
      });

      if (Object.keys(passengerMap).length > 0) {
        result.passengerList = Object.values(passengerMap);
      }

      const seatMap: Record<string, any> = {};

      Object.entries(result).forEach(([key, value]) => {
        const match = key.match(
          /^(.+?)_seat(Number|Letter)(Departure|Return)$/
        );

        if (!match) return;

        const passengerType = match[1];
        const part = match[2];
        const segment = match[3];

        if (!seatMap[passengerType]) {
          seatMap[passengerType] = {
            passengerType,
            seatDeparture: "",
            seatReturn: "",
          };

          if (result.homeisActiveOptionOutbound !== "false") {
            delete seatMap[passengerType].seatReturn;
          }
        }

        const current = seatMap[passengerType];

        if (segment === "Departure") {
          current.seatDeparture =
            part === "Letter"
              ? `${current.seatDeparture.replace(/^[A-Z]/, "")}${String(
                  value
                ).toUpperCase()}`
              : `${value}${current.seatDeparture.replace(/\d+$/, "")}`;
        }

        if (
          segment === "Return" &&
          result.homeisActiveOptionOutbound === "false"
        ) {
          current.seatReturn =
            part === "Letter"
              ? `${current.seatReturn.replace(/^[A-Z]/, "")}${String(
                  value
                ).toUpperCase()}`
              : `${value}${current.seatReturn.replace(/\d+$/, "")}`;
        }

        delete result[key];
      });

      if (Object.keys(seatMap).length > 0) {
        result.seatByPassengerList = Object.values(seatMap);
      }
      break;

    case "edit":
      Object.entries(result).forEach(([key, value]) => {
        if (key === "passengerList" || key === "seatByPassengerList") return;

        if (typeof value === "object" && value !== null) {
          const isActive = Object.values(value).some((value) => {
            if (typeof value === "boolean") return value === true;
            if (typeof value === "number") return value > 0;
            if (typeof value === "string")
              return value.trim() !== "" && value !== "false";
            return false;
          });

          result[key] = String(isActive);

          Object.entries(value).forEach(([innerKey, innerValue]) => {
            result[innerKey] = String(innerValue);
          });
        } else if (typeof value === "boolean" || typeof value === "number") {
          result[key] = String(value);
        }
      });

      stepFields.forEach((step) => {
        step.input.forEach((field) => {
          if (field.type === "date" && result[field.name]) {
            result[field.name] =
              formatDate(result[field.name], "yyyy-mm-dd") ?? "";
          }
        });
      });

      if (Array.isArray(result.passengerList)) {
        result.passengerList.forEach((passenger: any) => {
          const passengerType = passenger.passengerType;

          Object.entries(passenger).forEach(([key, value]) => {
            if (key === "passengerType") return;

            result[`${passengerType}_${key}`] = String(value);
          });
        });

        delete result.passengerList;
      }

      if (Array.isArray(result.seatByPassengerList)) {
        result.seatByPassengerList.forEach((seat: any) => {
          const passengerType = seat.passengerType;

          if (seat.seatDeparture) {
            const match = String(seat.seatDeparture).match(/^(\d+)([A-Z])$/);

            if (match) {
              const [, number, letter] = match;

              result[`${passengerType}_seatNumberDeparture`] = number;
              result[`${passengerType}_seatLetterDeparture`] = letter;
            }
          }

          if (seat.seatReturn) {
            const match = String(seat.seatReturn).match(/^(\d+)([A-Z])$/);

            if (match) {
              const [, number, letter] = match;

              result[`${passengerType}_seatNumberReturn`] = number;
              result[`${passengerType}_seatLetterReturn`] = letter;
            }
          }
        });

        delete result.seatByPassengerList;
      }
      break;

    default:
      break;
  }

  return result;
};
