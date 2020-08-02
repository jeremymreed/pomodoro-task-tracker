class NotificationOptions {
  constructor() {
    this.notificationOptions = new Map();
    this.notificationOptions.set(
      'taskStopped', {
        title: 'Stopped Task',
        body: 'The task has been stopped',
        urgency: 'normal'
      });

    this.notificationOptions.set(
      'timeToRest', {
        title: 'Rest!',
        body: 'You should take a rest now...',
        urgency: 'critical'
      });

    this.notificationOptions.set(
      'taskUpdated', {
        title: 'Task Updated',
        body: 'The task was updated',
        urgency: 'normal'
      });

    this.notificationOptions.set(
      'settingsUpdated', {
        title: 'Settings Updated',
        body: 'The Settings were updated',
        urgency: 'normal'
      });

    this.notificationOptions.set(
      'taskDone', {
        title: 'Task Done',
        body: 'You completed the task!  Great job!  Keep going!',
        urgency: 'normal'
      });
  }

  getNotification(notificationName) {
    if (this.notificationOptions.has(notificationName)) {
      return this.notificationOptions.get(notificationName);
    } else {
      throw new Error('Invalid Notification Name!');
    }
  }
}

export default NotificationOptions;
