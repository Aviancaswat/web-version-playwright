import * as azdev from "azure-devops-node-api"
import dotenv from "dotenv"
import express, { type Request, type Response } from "express"

dotenv.config()

const app = express()
const port = 3000
const projectname = "playwright-avianca";

const getConnectionAzure = () => {
    let orgUrl = "https://dev.azure.com/fainnerramirez";
    let token = process.env.AZURE_PERSONAL_ACCESS_TOKEN as string;
    console.log("Token: ", token)
    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    return connection;
}

const connection = getConnectionAzure();

//0bd2f129-0c8d-40b4-bc5e-66c4223c8eff - repo id

app.get("/", (req: Request, res: Response) => {
    res.send("Hola mundo")
})


app.get("/repo", async (req: Request, res: Response) => {
    const api = await connection.getGitApi();
    const repos = await api.getRepositories(projectname)
    res.send(JSON.stringify(repos, null, 2))
})

app.listen(port, () => {
    console.log(`Listen in port ${port}`)
})