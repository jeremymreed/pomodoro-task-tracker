v0.9.0 - Fri Sep 11 15:35:27 2020 -0400
v0.8.0 - Wed Sep 9 16:22:07 2020 -0400
v0.7.0 - Wed Sep 9 16:00:47 2020 -0400
v0.6.3 - Thu Aug 27 21:18:25 2020 -0400
v0.6.2 - Thu Aug 27 17:20:11 2020 -0400
v0.6.1 - Wed Aug 26 12:56:13 2020 -0400
v0.6.0 - Tue Aug 25 16:42:13 2020 -0400
v0.5.1 - Mon Aug 24 10:02:29 2020 -0400
v0.5.0 - Sun Aug 23 16:36:34 2020 -0400
v0.4.3 - Tue Aug 18 16:30:17 2020 -0400
v0.4.2 - Tue Aug 18 08:16:46 2020 -0400
v0.4.1 - Tue Aug 18 07:09:47 2020 -0400
v0.4.0 - Fri Aug 14 16:06:02 2020 -0400
v0.3.0 - Wed Aug 12 16:26:46 2020 -0400
v0.2.0 - Mon Aug 10 22:21:20 2020 -0400
v0.1.8 - Fri Aug 7 11:09:04 2020 -0400
v0.1.7 - Thu Aug 6 21:07:25 2020 -0400
v0.1.6 - Thu Aug 6 14:49:52 2020 -0400
v0.1.5 - Thu Aug 6 09:04:35 2020 -0400
v0.1.4 - Wed Aug 5 16:40:15 2020 -0400
v0.1.3 - Wed Aug 5 12:16:21 2020 -0400
v0.1.2 - Mon Aug 3 13:59:29 2020 -0400
v0.1.1 - Mon Aug 3 13:46:31 2020 -0400
v0.1.0 - Mon Aug 3 13:19:20 2020 -0400
v0.0.7 - Fri Jul 31 23:18:19 2020 -0400
v0.0.6 - Tue Jul 28 23:02:02 2020 -0400
v0.0.5 - Mon Jul 27 23:10:09 2020 -0400

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
