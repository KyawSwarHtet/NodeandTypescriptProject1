import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  automock: false,
  //   clearMocks: true,
  setupFiles: ["dotenv/config"],
  testMatch: ["**/**/*.test.ts"],
  //   setupFilesAfterEnv: ["./jest.setup.ts"],
};
export default config;
