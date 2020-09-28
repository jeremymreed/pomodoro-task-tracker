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
import os from "os";
import Database from "../database";

let configPathBase = os.homedir() + "/.config/pomodoro-task-tracker/";
// Default to production database.
let databaseName = "pomodoro-task-tracker-data";

try {
  let configDir = fs.opendirSync(configPathBase);
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("Creating config directory!");
    fs.mkdirSync(configPathBase);
  }
}

if (process.argv.length === 3) {
  databaseName = process.argv[2];
}

const databasePath = configPathBase + databaseName;
console.log("App constructor: databasePath", databasePath);

const db = new Database(databasePath);

/*
  Initial database seed.
 */

const installDB = async () => {
  console.log("--- installDB() ---------------------------------");

  await db.createIndexes();

  console.log("---------------------------------------------");
};

installDB()
  .then(() => {
    console.log("Installed the database!");
  })
  .catch((error) => {
    console.log("Caught error: ", error);
  });
