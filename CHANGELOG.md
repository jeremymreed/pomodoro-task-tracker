# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

## [Unreleased]

## [v0.9.0] - 2020-09-11 - 15:35:27 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.8.0] - 2020-09-09 - 16:22:07 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.7.0] - 2020-09-09 - 16:00:47 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.6.3] - 2020-08-27 - 21:18:25 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.6.2] - 2020-08-27 - 17:20:11 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.6.1] - 2020-08-26 - 12:56:13 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.6.0] - 2020-08-25 - 16:42:13 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.5.1] - 2020-08-24 - 10:02:29 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.5.0] - 2020-08-23 - 16:36:34 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.4.3] - 2020-08-18 - 16:30:17 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.4.2] - 2020-08-18 - 08:16:46 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.4.1] - 2020-08-18 - 07:09:47 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.4.0] - 2020-08-14 - 16:06:02 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.3.0] - 2020-08-12 - 16:26:46 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.2.0] - 2020-08-10 - 22:21:20 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.1.8] - 2020-08-07 - 11:09:04 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.1.7] - 2020-08-06 - 21:07:25 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.1.6] - 2020-08-06 - 14:49:52 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


## [v0.1.5] - 2020-08-06 - 09:04:35 ET
### Added

### Changed

### Deprecated

### Removed

### Fixed

### Security


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

[unreleased]: https://github.com/jeremymreed/pomodoro-task-tracker/compare/v0.9.0...HEAD
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