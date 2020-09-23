type SettingsValue =
  | null
  | boolean
  | string
  | number
  | SettingsObject
  | SettingsValue[];

type SettingsObject = {
  [key: string]: SettingsValue;
};
