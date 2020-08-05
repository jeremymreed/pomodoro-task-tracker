class TimeConverter {
  static getAsDays(durationInSeconds) {
    if (Math.trunc(durationInSeconds.asDays()) < 10) {
      return `0${Math.trunc(durationInSeconds.asDays())}`;
    } else {
      return `${Math.trunc(durationInSeconds.asDays())}`;
    }
  }

  static getHours(durationInSeconds) {
    if (durationInSeconds.hours() < 10) {
      return `0${durationInSeconds.hours()}`;
    } else {
      return `${durationInSeconds.hours()}`;
    }
  }

  static getAsMinutes(durationInSeconds) {
    if (Math.trunc(durationInSeconds.asMinutes()) < 10 ) {
      return `0${Math.trunc(durationInSeconds.asMinutes())}`;
    } else {
      return `${Math.trunc(durationInSeconds.asMinutes())}`;
    }
  }

  static getMinutes(durationInSeconds) {
    if (durationInSeconds.minutes() < 10) {
      return `0${durationInSeconds.minutes()}`;
    } else {
      return `${durationInSeconds.minutes()}`;
    }
  }

  static getSeconds(durationInSeconds) {
    if (durationInSeconds.seconds() < 10 ) {
      return `0${durationInSeconds.seconds()}`;
    } else {
      return `${durationInSeconds.seconds()}`;
    }
  }
}

export default TimeConverter;
