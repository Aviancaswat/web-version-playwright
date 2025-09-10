//https://dev.azure.com/{organization}/{project}/_apis/pipelines?api-version=7.1

const versionAPI = "api-version=7.1";
const organization = "fainnerramirez";
const projectname = "playwright-avianca";
const baseURL = `https://dev.azure.com/${organization}/${projectname}/_apis/pipelines?${versionAPI}`

export const createPipeline = async () => {
    console.log("baseURL: ", baseURL);
    const response = await fetch(baseURL, {
        method: "POST"
    });
    console.log("response api azure: ", response)
}

// Resumen de los pasos:

// Generar un PAT (Token de acceso personal).

// Obtener el ID del repositorio donde deseas hacer el commit.

// Crear una solicitud POST a la API de Azure DevOps con el cuerpo JSON que describe el commit.

// Autenticación utilizando el PAT.

// Enviar la solicitud usando curl o cualquier cliente HTTP de tu preferencia.
