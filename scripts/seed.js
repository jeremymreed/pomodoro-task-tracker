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

import os from 'os';
import Database from './database';
import Task from './data-models/task';

const databasePath = os.homedir() + '/.config/pomodoro-task-tracker/pomodoro-task-tracker-data';
console.log('App constructor: databasePath', databasePath);

const db = new Database(databasePath);

let tasks = [
  new Task('2085beaf-03eb-4ef8-95af-27193e16845b', null, 'Task00', 'Test Task00', 'Label0', 0, false),
  new Task('9304ec0b-8f4f-45b3-a79e-5198a88806cf', null, 'Task01', 'Test Task01', 'Label1', 50000, true),
  new Task('251d9a36-a0b6-43d3-8bb5-16cc6e825c3c', null, 'Task02', 'Test Task02', 'Label0', 10000, false),
  new Task('1954d315-d3c1-4aaf-8828-e42a2a2289fa', null, 'Task03', 'Test Task03', 'Label0', 0, false),
  new Task('0330f859-cb08-4bb2-a5ac-84f13f07daa8', null, 'Task04', 'Test Task04', 'Label1', 50000, true),
  new Task('2e6e6135-138d-4577-8e13-283ba72a5a50', null, 'Task05', 'Test Task05', 'Label0', 10000, false),
  new Task('e309af8e-5625-47d0-993a-e67242c8387b', null, 'Task06', 'Test Task06', 'Label0', 0, false),
  new Task('890b9890-f7dd-4e67-b9d0-e8cb16c252ab', null, 'Task07', 'Test Task07', 'Label1', 50000, true),
  new Task('3e339ddf-53c8-44c7-ba4e-a06722561686', null, 'Task08', 'Test Task08', 'Label0', 10000, false),
  new Task('b3229b49-bef8-47b6-980d-775ffcf9c230', null, 'Task09', 'Test Task09', 'Label0', 0, false),
  new Task('4d6780b8-52b7-423a-80da-8e0e74640dbe', null, 'Task10', 'Test Task10', 'Label1', 50000, true),
  new Task('6ab6ec93-d5ce-434f-ae0c-215142e91af6', null, 'Task11', 'Test Task11', 'Label0', 10000, false),
  new Task('969e78ba-dd6f-464d-9458-b881d26564f7', null, 'Task12', 'Test Task12', 'Label0', 0, false),
  new Task('15f9d7a6-22ad-434b-a9a3-00010437b0da', null, 'Task13', 'Test Task13', 'Label1', 50000, true),
  new Task('d02fb63d-3b9f-4a02-bbd5-d117bc76db7f', null, 'Task14', 'Test Task14', 'Label0', 10000, false),
  new Task('aae6ff82-a04f-4e38-b53f-72b0923cc7d4', null, 'Task15', 'Test Task15', 'Label0', 0, false),
  new Task('a3aa80ea-c841-44d1-9a1d-51fc98e8b4da', null, 'Task16', 'Test Task16', 'Label1', 50000, true),
  new Task('c984d61a-5c91-47d2-a2b1-dc5db4de8ff1', null, 'Task17', 'Test Task17', 'Label0', 10000, false),
];

/*
  Initial database seed.
 */

const seedDB = async () => {
  console.log('--- seedDB() ---------------------------------');

  for ( let i = 0 ; i < tasks.length ; i++ ) {
    const rev = await db.upsert(tasks[i]);

    if (rev !== null) {
      tasks[i]._rev = rev;
    } else {
      console.log('Got invalid rev!');
    }
  }

  console.log('tasks: ', tasks);
  console.log('---------------------------------------------');
}

seedDB().then(() => { console.log('Seeded the database!'); }).catch((error) => { console.log('Caught error: ', error); });
