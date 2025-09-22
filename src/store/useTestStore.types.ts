export interface Test {
  [key: string]: any;
}

export interface TestStore {
  tests: Test[];
  addTest: (test: Test) => void;
  removeTest: (index: number) => void;
  updateTest: (index: number, test: Test) => void;
  clearTests: () => void;
  isBlocked: boolean;
  blockForm: () => void;
  unblockForm: () => void;
}
