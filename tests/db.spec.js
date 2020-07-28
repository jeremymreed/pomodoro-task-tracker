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

import chai from 'chai';
import DB from '../src/mock-db/db';
import Task from '../src/data-models/task'

describe('mock db tests', () => {
  describe('addTask tests', () => {
    it('should add new task', () => {
      const db = new DB();

      const testTask = new Task(0, 'Foo', 'Foo Bar');

      db.addTask(testTask);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask);
    });

    it('should update task', () => {
      const db = new DB();

      const testTask = new Task(0, 'Foo', 'Foo Bar');

      db.addTask(testTask);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask);

      const testTask2 = new Task(0, 'Bar', 'Bar Foo', true);

      db.addTask(testTask2);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask2);
    });
  });

  describe('removeTask tests', () => {
    it('should remove existing task', () => {
      const db = new DB();

      const testTask = new Task(0, 'Foo', 'Foo Bar');

      db.addTask(testTask);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask);

      db.removeTask(testTask.id);
      chai.assert.strictEqual(db.data.size, 0);
    });

    it('should do nothing when task does\'t exist', () => {
      const db = new DB();

      const testTask = new Task(0, 'Foo', 'Foo Bar');

      db.addTask(testTask);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask);

      db.removeTask(1);
      chai.assert.strictEqual(db.data.size, 1);
      chai.assert.deepStrictEqual(db.data.get(0), testTask);
    });
  });

  describe('getNextId tests', () => {
    it('should return expected next id', () => {
      const db = new DB();

      for ( let i = 0 ; i <= 100 ; i++ ) {
        const next = db.getNextId();
        chai.assert.strictEqual(next, i);
      }
    });
  });

  describe('restoreData tests', () => {
    it('should restore data from valid json blob', () => {
      const task0 = new Task(0, "Foo", "Foo Bar", true);
      const task1 = new Task(1, "Bar", "Bar Foo", false);
      const task2 = new Task(2, "Test", "A test task", true);

      const expectedMap = new Map();
      expectedMap.set(task0.id, task0);
      expectedMap.set(task1.id, task1);
      expectedMap.set(task2.id, task2);

      const jsonData =
        {
          "nextId": 3,
          "data": [
            {"id": 0, "name": "Foo", "description": "Foo Bar", "done": true},
            {"id": 1, "name": "Bar", "description": "Bar Foo", "done": false},
            {"id": 2, "name": "Test", "description": "A test task", "done": true}
          ]
        };

      const db = new DB();
      db.restoreData(jsonData);
      chai.assert.strictEqual(db.nextId, 3);
      chai.assert.deepStrictEqual(db.data, expectedMap);
    });
  });
});
