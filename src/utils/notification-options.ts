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

class NotificationOptions {
  notificationOptions: Map<string, Electron.NotificationConstructorOptions>;

  constructor() {
    this.notificationOptions = new Map();
    this.notificationOptions.set("taskStopped", {
      title: "Stopped Task",
      body: "The task has been stopped",
      urgency: "normal",
    });

    this.notificationOptions.set("timeToRest", {
      title: "Rest!",
      body: "You should take a rest now...",
      urgency: "normal",
    });

    this.notificationOptions.set("timeToWork", {
      title: "Work!",
      body: "It's time to get back to work!",
      urgency: "normal",
    });

    this.notificationOptions.set("taskUpdated", {
      title: "Task Updated",
      body: "The task was updated",
      urgency: "normal",
    });

    this.notificationOptions.set("labelUpdated", {
      title: "Label Updated",
      body: "The label was updated",
      urgency: "normal",
    });

    this.notificationOptions.set("settingsUpdated", {
      title: "Settings Updated",
      body: "The Settings were updated",
      urgency: "normal",
    });

    this.notificationOptions.set("taskDone", {
      title: "Task Done",
      body: "You completed the task!  Great job!  Keep going!",
      urgency: "normal",
    });

    this.notificationOptions.set("disallow-start-task-when-done", {
      title: "Cannot start",
      body: "You cannot start a task that is done!",
      urgency: "normal",
    });
  }

  getNotification(notificationName: string) {
    if (this.notificationOptions.has(notificationName)) {
      return this.notificationOptions.get(notificationName);
    } else {
      throw new Error("Invalid Notification Name!");
    }
  }
}

export default NotificationOptions;
