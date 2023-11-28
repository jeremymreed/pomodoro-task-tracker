# Pomodoro Task Tracker

### Table of Contents

1. [Purpose](https://github.com/jeremymreed/pomodoro-task-tracker#purpose)
2. [Requirements](https://github.com/jeremymreed/pomodoro-task-tracker#requirements)
3. [Usage](https://github.com/jeremymreed/pomodoro-task-tracker#usage)
4. [Config](https://github.com/jeremymreed/pomodoro-task-tracker#license)
5. [Debugging](https://github.com/jeremymreed/pomodoro-task-tracker#debugging)
6. [License](https://github.com/jeremymreed/pomodoro-task-tracker#license)

<h1>This repository is not being maintained.</h1>

Screenshot:
[![pomdoro-task-tracker-screenshot](images/task-list-with-task-done.png "Completed Task")](https://github.com/jeremymreed/pomodoro-task-tracker/-/blob/master/images/task-list-with-task-done.png)

# Purpose:

This is an electron app to track tasks, using the pomodoro technique.

Warning: This software is very much alpha quality. Do not use this to track tasks in a production environment.

I have only tested this software on Linux.

# Requirements:

This software has the following requirements:

1. nodejs v14.21.3 runtime.  This is the current lts/fermium release.

# Usage:

You will need to have [nodejs and npm](https://nodejs.org/en/) installed on your machine to use this software.

I use [node version manager](https://github.com/nvm-sh/nvm) to manage my nodejs versions.

Clone this repository. Go into the pomodoro-task-tracker directory.

Run:

```
npm ci
```

PRODUCTION:

Build the software.

```
npm run build
```

Setup the Database.  This creates the config directory, and sets up the required indexes.

```
npm run setup
```

For testing purposes, you might want to seed the database with some test data:

```
npm run seed
```

Then run:

```
npm start
```

DEVELOPMENT:

Build the software.

```
npm run build-dev
```

Setup the Database.  This creates the config directory, and sets up the required indexes.

```
npm run setup-dev
```

For testing purposes, you might want to seed the database with some test data:

```
npm run seed-dev
```

Then run:

```
npm start-dev
```

# Config:

This program has a settings editor that can be accessed from the main screen.

On Linux: The settings are stored in ~./config/pomdoro-task-tracker/settings.json

# Debugging:

If you need to debug this app, you can turn debugging on by:

You can enable dev tools by going to Help -> Toggle Developer Tools.

Electron:
Set these environment variables, then run the software: (Source: https://github.com/electron/electron/issues/4677#issuecomment-193141998)

```
export ELECTRON_ENABLE_LOGGING=1
export ELECTRON_ENABLE_STACK_DUMPING=1
npm start
```

PouchDB:
In src/windows/app.js, uncomment the db.enableDebug() line.
To disable debug, you'll need to add db.disableDebug(), and comment out the enableDebug() call.
(I am going to make this a togglable option under Edit, similar to enabling dev tools)

# License:

This program is licensed under the GPLv2 License.
