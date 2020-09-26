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

import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  MuiThemeProvider,
  createMuiTheme,
  Theme,
} from "@material-ui/core/styles";
import electronSettings from "electron-settings";
import App from "./windows/app/app";

const lightTheme = createMuiTheme({
  palette: {
    type: "light",
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const themeMap = new Map([
  ["light", lightTheme],
  ["dark", darkTheme],
]);

const getThemeName = (): string => {
  if (!electronSettings.has("theme")) {
    return "light";
  }

  return electronSettings.getSync("theme") as string;
};

interface State {
  currentTheme: Theme;
}

class ThemedApp extends React.Component<
  Readonly<Record<string, unknown>>,
  State
> {
  constructor(props: Readonly<Record<string, unknown>>) {
    super(props);

    this.changeTheme = this.changeTheme.bind(this);

    const themeName = getThemeName();

    if (themeName === undefined || themeName === null) {
      throw new Error("ThemedApp: themeName is null or undefined!");
    }

    const currentTheme = themeMap.get(themeName.toString());

    if (currentTheme === undefined) {
      throw new Error("currentTheme is undefined!");
    }

    this.state = {
      currentTheme,
    };
  }

  changeTheme(themeName: string) {
    if (themeName === "light") {
      this.setState({ currentTheme: lightTheme });
    } else if (themeName === "dark") {
      this.setState({ currentTheme: darkTheme });
    } else {
      throw Error("Invalid theme name!");
    }
  }

  render() {
    const { currentTheme } = this.state;

    return (
      <div>
        <MuiThemeProvider theme={currentTheme}>
          <CssBaseline />
          <App changeTheme={this.changeTheme} />
        </MuiThemeProvider>
      </div>
    );
  }
}

ReactDOM.render(<ThemedApp />, document.getElementById("root"));
