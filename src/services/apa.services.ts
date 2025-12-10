import { APARepository } from "@/repository/apa.repository";

export class APAService {
    static generateContentDashboard(dataDashboard: string, questionUser: string): AsyncGenerator<string, any, unknown> {
        return APARepository.generateContentDashboard(dataDashboard, questionUser);
    }
}