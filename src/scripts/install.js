const fs = require("fs");
const Database = require("../database");
const EnvPaths = require("../paths");

const getDatabaseName = () => {
  // Default to production database.
  let databaseName = "pomodoro-task-tracker-data";

  if (process.argv.length === 3) {
    [, , databaseName] = process.argv;
  }

  return databaseName;
};

const createConfigDir = () => {
  const envPaths = new EnvPaths();

  const configPathBase = envPaths.getConfig();

  // eslint-disable-next-line no-console
  console.log("configPathBase: ", configPathBase);

  try {
    const testDir = fs.opendirSync(configPathBase);
    testDir.closeSync();
  } catch (error) {
    if (error.code === "ENOENT") {
      // eslint-disable-next-line no-console
      console.log("Creating config directory!");
      fs.mkdirSync(configPathBase);
    }
  }

  return configPathBase;
};

const setupDatabase = async (databasePath) => {
  const db = new Database(databasePath);

  db.disableDebug();
  await db.createIndexes();
  await db.close();
};

const install = async () => {
  const configPathBase = createConfigDir();
  const databaseName = getDatabaseName();
  await setupDatabase(`${configPathBase}/${databaseName}`);
};

install().then(() => {
  console.log("The database was setup successfully.")
}).catch((error) => {
  console.log(`There was an error: ${error}`);
});
