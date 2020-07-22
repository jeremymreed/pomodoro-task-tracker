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

      db.removeTask(testTask._id);
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
});
