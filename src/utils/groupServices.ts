export const groupServices = (data: Record<string, any>) => {
  const serviceGroups: Record<string, string[]> = {
    servicesEquipajeManoBodega: [
      "servicesEquipajeManoIda",
      "servicesEquipajeManoVuelta",
      "servicesEquipajeBodegaIda",
      "servicesEquipajeBodegaVuelta",
    ],
    servicesEquipajeDeportivo: [
      "servicesDeportivoBicicletaIda",
      "servicesDeportivoBicicletaVuelta",
      "servicesDeportivoGolfIda",
      "servicesDeportivoGolfVuelta",
      "servicesDeportivoBuceoIda",
      "servicesDeportivoBuceoVuelta",
      "servicesDeportivoSurfIda",
      "servicesDeportivoSurfVuelta",
      "servicesDeportivoEsquiarIda",
      "servicesDeportivoEsquiarVuelta",
    ],
    servicesAbordajePrioritario: [
      "servicesAbordajePrioritarioIda",
      "servicesAbordajePrioritarioVuelta",
    ],
    servicesAviancaLounges: [
      "servicesLoungesPrioritarioIda",
      "servicesLoungesPrioritarioVuelta",
    ],
    servicesAsistenciaEspecial: [
      "servicesAsistenciaDiscapacidadVisualIda",
      "servicesAsistenciaDiscapacidadVisualVuelta",
      "servicesAsistenciaDiscapacidadAuditivaIda",
      "servicesAsistenciaDiscapacidadAuditivaVuelta",
      "servicesAsistenciaDiscapacidadIntelectualIda",
      "servicesAsistenciaDiscapacidadIntelectualVuelta",
      "servicesAsistenciaPerroServicioIda",
      "servicesAsistenciaPerroServicioVuelta",
      "servicesAsistenciaDiscapacidadFisicaIda",
      "servicesAsistenciaDiscapacidadFisicaVuelta",
    ],
  };

  const services: Record<string, any> = {};

  Object.entries(serviceGroups).forEach(([mainKey, children]) => {
    if (data[mainKey] === true) {
      const nested: Record<string, any> = {};

      children.forEach((child) => {
        if (child in data) {
          const value = data[child];

          if (typeof value === "boolean") {
            nested[child] = value;
          } else if (!isNaN(Number(value))) {
            nested[child] = Number(value);
          } else {
            nested[child] = value;
          }

          delete data[child];
        }
      });

      services[mainKey] = nested;
    }
  });

  if (typeof data.servicesAsistenciaViaje === "boolean") {
    services.servicesAsistenciaViaje = data.servicesAsistenciaViaje;
    delete data.servicesAsistenciaViaje;
  }

  return { ...data, ...services };
};
