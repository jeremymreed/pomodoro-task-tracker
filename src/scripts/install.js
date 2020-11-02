/*
Copyright © 2020 Jeremy M. Reed

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

import fs from "fs";
import EnvPaths from "../paths";
import Database from "../database";

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
