Pomodoro Task Tracker
======================================

### Table of Contents
1. [Purpose](https://gitlab.com/jeremymreed/pomodoro-task-tracker#purpose)
2. [Usage](https://gitlab.com/jeremymreed/pomodoro-task-tracker#usage)
3. [Config](https://gitlab.com/jeremymreed/pomodoro-task-tracker#license)
4. [License](https://gitlab.com/jeremymreed/pomodoro-task-tracker#license)

Screenshot:
[![pomdoro-task-tracker-screenshot](images/main-view-with-task-done-2020-08-05.png "Completed Task")](https://gitlab.com/jeremymreed/pomodoro-task-tracker/-/blob/develop/images/main-view-with-task-done-2020-08-05.png)

# Purpose:
This is an electron app to track tasks, using the pomodoro technique.

Warning: This software is very much alpha quality.  Do not use this to track tasks in a production environment.

I have only tested this software on Linux.  (I use Manjaro KDE)

# Usage:

You will need to have [nodejs and npm](https://nodejs.org/en/) installed on your machine to use this software.

Clone this repository. Go into the pomodoro-task-tracker directory.

Run:
```
npm install
```

Then run:
```
npm run project:start
```

To run tests: (test coverage sucks a bit.)
```
npm run test
```

# Config:

This program has a settings editor that can be accessed from the main screen.

On Linux:  The settings are stored in ~./config/pomdoro-task-tracker/settings.json

# License:
This program is licensed under the GPLv2 License.
