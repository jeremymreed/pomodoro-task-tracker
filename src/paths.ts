import envPaths from "env-paths";

class EnvPaths {
  paths: {
    data: string;
    config: string;
    cache: string;
    log: string;
    temp: string;
  };

  constructor() {
    const options = { suffix: "" };
    this.paths = envPaths("pomodoro-task-tracker", options);
  }

  getData(): string {
    return this.paths.data;
  }

  getConfig(): string {
    return this.paths.config;
  }
}

export default EnvPaths;
