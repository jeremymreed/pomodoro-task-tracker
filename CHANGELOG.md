# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]

## [v0.12.0] - 2020-12-03 11:40
## Changed
- App: Refactor state transition functions.

## [v0.11.0] - 2020-11-02 14:31
## Added
- Create setup script.
- Acceptance test procedure.

## Changed
- App: Refactor editLabel to take label reference as opposed to separate fields.
- App: Refactor editTask to take task reference as opposed to separate fields.

## Fixed
- EditLabel: Unable to create new task.
- EditLabel: Label name validation.

## [v0.10.1] - 2020-09-23 - 18:45:00
## Security
- Fixed https://github.com/advisories/GHSA-56pc-6jqp-xqj8 by updating Electron to ^9.3.0

## [v0.10.0] - 2020-09-23 - 18:13:00
### Added
- This changelog!
- Create enumerations to get rid of some magic numbers. (State vars, phase types, etc)
- Add database path as command line argument.
- installed env-paths.
- Installed Prettier.
- Set up eslint typescript.
- Installed Typescript.

### Changed
- Use env-paths to standardize our config location.
- Changes to installation process, updated README to reflect these changes.
- Turn Luxafor flag off when pausing the current Task.
- Only track time the current phase is 'Work'.
- Handled linting issues.
- A bunch of refactors, renaming to make code clearer.
- Refactored Task.label to Task.labelId, Label.label to LabelId to make things clear.
- Update README to describe installation process.
- Ported code to Typescript.

### Fixed
- Fixed Luxafor flag does not clear properly when going from TaskRunning -> Settings Editor.
- Clear Luxafor flag when quitting via menu.
- Seed script should not assume the user is using Linux.


## [v0.9.0] - 2020-09-11 - 15:35:27 ET
### Changed
- Update Screenshot.
- Use icon buttons instead of buttons with text.


## [v0.8.0] - 2020-09-09 - 16:22:07 ET
### Added
- Labels.

### Changed
- Update UI to include Labels.
- Added scrollbar to TaskList View.

### Deprecated

### Removed

### Fixed
- Use Label Ids, not names to identify labels.
- Make sure filter select is active when there are no tasks in the TaskList.


## [v0.7.0] - 2020-09-09 - 16:00:47 ET
### Security
- Fixed security issue in dependency bl.


## [v0.6.3] - 2020-08-27 - 21:18:25 ET
### Added
- Code of Conduct.

### Changed
- Add License Headers.
- Move new Luxafor() invocation to LuxaforUtils constructor.

### Deprecated

### Removed

### Fixed

### Security


## [v0.6.2] - 2020-08-27 - 17:20:11 ET
### Added
- Installed electron-builder.

### Changed
- Migrated from electron-forge to electron-builder for packaging purposes.

### Removed
- electron-forge.

### Fixed
- Make sure the luxafor flag is initialized when calling color() and strobe() to avoid issue when flag is unplugged while the app is running.


## [v0.6.1] - 2020-08-26 - 12:56:13 ET
### Fixed
- install should be installDB in npm scripts.


## [v0.6.0] - 2020-08-25 - 16:42:13 ET
### Added
- Luxafor integration.
- Installed node-luxafor2.
- Ghetto Profiler utility.

### Changed
- Update README with luxafor related information.
- Cleaned up seed / install scripts.


## [v0.5.1] - 2020-08-24 - 10:02:29 ET
### Added
- PouchDB performance profiling.
- Added simple profiling code.
- Created install script.
- Installed pouchdb-debug.

### Changed
- Open devtools by default.
- Enable PouchDB debugging.

### Removed
- Debug prints.


## [v0.5.0] - 2020-08-23 - 16:36:34 ET
### Added
- Added filtering to the TaskList.
- Created seed script.
- Created indexes.
- Created mappers to map raw data to data-model objects.
- Installed PouchDB.

### Changed
- Moved database file to data/
- Update code to use PouchDB.

### Removed
- Old file based database system.
- Tests for old file based database.


## [v0.4.3] - 2020-08-18 - 16:30:17 ET
### Added
- Installed formik.

### Changed
- Update forms to use formik.

### Removed
- Old form validation code.


## [v0.4.2] - 2020-08-18 - 08:16:46 ET
### Changed
- EditTask: Disable save button when errors exist.
- More form validation.


## [v0.4.1] - 2020-08-18 - 07:09:47 ET
### Added
- Edit Task form validation.

### Security
- Ran npm audit fix.


## [v0.4.0] - 2020-08-14 - 16:06:02 ET
### Added
- Light / Dark mode.

### Changed
- Updated Screenshot.
- Change Add New Task View title.


## [v0.3.0] - 2020-08-12 - 16:26:46 ET
### Added
- Add Work / Rest notifications.
- Custom DB path.

### Changed
- Make critical notifications normal priority.
- Show version string in About dialog.
- Make task name textfield multiline, with 4 rows.
- Show useful message when no tasks exist.
- Limit task title length to 200 characters.

### Removed
- Debug prints.

### Fixed
- Fixed Settings Editor not saving properly.


## [v0.2.0] - 2020-08-10 - 22:21:20 ET
### Added
- Installed Material UI Icons.

### Changed
- Update Screenshot.
- UI Cleanup work.
- Migrate UI to Material UI.

### Fixed
- Don't show fractional minutes.


## [v0.1.8] - 2020-08-07 - 11:09:04 ET
### Changed
- Mark min/max values on sliders in settings editor.

### Removed
- Removed edit settings buttons from MainView.


## [v0.1.7] - 2020-08-06 - 21:07:25 ET
### Added
- Installed Material UI.

### Changed
- Change Submit to Save in settings editor.
- Use sliders in the settings editor for some settings.

### Fixed
- Fixed invalid inputs in the settings editor.


## [v0.1.6] - 2020-08-06 - 14:49:52 ET
### Added
- Custom menus.

### Changed
- Updated Screenshot.


## [v0.1.5] - 2020-08-06 - 09:04:35 ET
### Changed
- Remove custom menus.
- Don't show devtools by default.


## [v0.1.4] - 2020-08-05 - 16:40:15 ET
### Changed
- Update Screenshot.
- Humanize task on task string.
- Make displaying seconds optional, add to settings editor.


## [v0.1.3] - 2020-08-05 - 12:16:21 ET
### Changed
- UI improvements.
- TimeConverter utilities.
- Open devtools by default.


## [v0.1.2] - 2020-08-03 - 13:59:29 ET
### Removed
- Get rid of id and description columns in TaskList table.
- Debug prints.


## [v0.1.1] - 2020-08-03 - 13:46:31 ET
### Removed
- Debug prints.


## [v0.1.0] - 2020-08-03 - 13:19:20 ET
### Added
- Notifications.

### Changed
- Add done checkbox to EditTask form.
- Make description a textarea in EditTask form.
- Don't open devtools by default.
- Clean up README, add screenshot.
- License Headers.
- Change MainView title.

### Deprecated

### Removed
- Got rid of some old state variables.

### Fixed
- Don't start tasks that are done.

### Security


## [v0.0.7] - 2020-07-31 - 23:18:19 ET
### Added
- Settings Editor.
- Integrate electron-settings.
- Installed electron-settings.

### Changed
- Cleaned up form handling hooks.
- Cleaned up some of the Views.


## [v0.0.6] - 2020-07-28 - 23:02:02 ET
### Added
- Elasped time on task added to TaskRunningView UI.
- Pomodoro feature.


## [v0.0.5] - 2020-07-27 - 23:10:09 ET
### Added
- TaskRunningView View.
- Timer component.
- Implement pause, resume, done. (Timer functions)
- Install moment.
- Implement cancel edit. (EditTask)

### Changed

- Rename test-data.json to good-data.json for clarity.

### Removed
- Don't need toggleTask, startTask, and stopTask.

### Fixed
- Remove unneeded underscores.
- Fix test-data.json, had incorrect data.


## [v0.0.4] - 2020-07-27 - 14:30:55 ET
### Added
- State transition functions.
- TaskRunningView component.
- Implemented add and remove new task features.  Added tests for these features.
- Use mock-data.json for persistence.
- EditTaskDialog component.
- MainView: start, edit, remove, add buttons.
- TaskList component.
- Electron IPC stuff.
- MainView component.
- Installed prop-types.

### Changed
- Make EditTask a View.
- Move state to App component.
- Use state variables and conditional rendering to simulate routing.
- Code reorganization.
- Standardize file names for components.
- Clear database after testing.
- Integrate database.

### Fixed
- mapData bug.

### Removed
- Reach Router.
- HelloWorld component.
- Unneeded button used in initial prototype code.


## [v0.0.3] - 2020-07-22 - 16:45:46 ET
### Added
- test script to exercise database and FilePersistence module.
- FilePersistence module.
- Mock data.

### Changed
- Updated database to restore data from JSON.

### Fixed
- Naming issues in Task data model.


## [v0.0.2] - 2020-07-22 - 14:27:23 ET
### Added
- Create test npm script, update start npm script.
- Create tests for the database.
- Installed testing dependencies. (mocha, chai)

### Changed
- Use Map in database.


## [v0.0.1] - 2020-07-22 - 11:12:57 ET
### Added
- Integrated Reach Router.
- Code reorg.
- Created prototype code.  Intended to test integration of react, reach-router, and electron.
- Installed dependencies. (React, Electron, ESLint)
- Generated Electron Forge boilerplate.


## [v0.0.0] - 2020-07-13 - 21:07:55 ET
### Added
- Initial commit.

[unreleased]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.12.0...HEAD
[v0.12.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.11.0...v0.12.0
[v0.11.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.10.1...v0.11.0
[v0.10.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.10.0...v0.10.1
[v0.10.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.9.0...v0.10.0
[v0.9.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.8.0...v0.9.0
[v0.8.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.7.0...v0.8.0
[v0.7.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.6.3...v0.7.0
[v0.6.3]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.6.2...v0.6.3
[v0.6.2]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.6.1...v0.6.2
[v0.6.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.6.0...v0.6.1
[v0.6.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.5.1...v0.6.0
[v0.5.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.5.0...v0.5.1
[v0.5.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.4.3...v0.5.0
[v0.4.3]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.4.2...v0.4.3
[v0.4.2]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.4.1...v0.4.2
[v0.4.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.2.0...v0.3.0
[v0.2.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.8...v0.2.0
[v0.1.8]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.7...v0.1.8
[v0.1.7]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.6...v0.1.7
[v0.1.6]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.5...v0.1.6
[v0.1.5]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.4...v0.1.5
[v0.1.4]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.3...v0.1.4
[v0.1.3]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.2...v0.1.3
[v0.1.2]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.1...v0.1.2
[v0.1.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.1.0...v0.1.1
[v0.1.0]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.7...v0.1.0
[v0.0.7]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.6...v0.0.7
[v0.0.6]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.5...v0.0.6
[v0.0.5]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.4...v0.0.5
[v0.0.4]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.3...v0.0.4
[v0.0.3]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.2...v0.0.3
[v0.0.2]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.1...v0.0.2
[v0.0.1]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.0.0...v0.0.1
[v0.0.0]: https://github.com/jeremymreed/pomodoro-task-tracker/releases/tag/v0.0.0