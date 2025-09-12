export interface Test {
  [key: string]: any;
}

export interface TestStore {
  tests: Test[];
  addTest: (test: Test) => void;
  removeTest: (index: number) => void;
  clearTests: () => void;
}
