import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResultWorkflow, StatusWorkflow } from '../github/api'

type State = {
    statusWorkflow: StatusWorkflow,
    resultWorkflow: ResultWorkflow
}

type Actions = {
    setStatusWorkflow: (newStatus: StatusWorkflow) => void,
    setResultWorkflow: (newResult: ResultWorkflow) => void
}

type Store = State & Actions

const store = create<Store>()(
    persist(
        (set) => ({
            statusWorkflow: "queued",
            resultWorkflow: "neutral",
            setStatusWorkflow: (newState) => set(() => ({ statusWorkflow: newState })),
            setResultWorkflow: (newResult) => set(() => ({ resultWorkflow: newResult }))
        }),
        {
            name: "test-store"
        }
    )
)

export const testStore = () => {
    const { statusWorkflow, resultWorkflow, setStatusWorkflow, setResultWorkflow } = store()
    return {
        statusWorkflow,
        resultWorkflow,
        setStatusWorkflow,
        setResultWorkflow
    }
}