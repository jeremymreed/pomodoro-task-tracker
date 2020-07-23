import fs from 'fs';
import process from 'process';
import path from 'path';

class FilePersistence {
  // Load raw data from file.
  static loadFromFile() {
    const rawData = fs.readFileSync(path.join(process.cwd(), '/data/mock-data.json'), 'utf8');
    const jsonData = JSON.parse(rawData);

    return jsonData;
  }

  // Maps data to proper format for writing to file.
  static mapData(nextId, dataMap) {
    const iter = dataMap.values();
    const dataArray = Array();

    let value = iter.next();
    while ( !value.done ) {
      dataArray.push(value);
      value = iter.next();
    }

    return (
      {
        'nextId': nextId,
        'data': dataArray }
      );
  }

  static saveToFile(dataArray) {
    fs.writeFileSync(
      path.join(process.cwd(), '/data/mock-data.json'),
      JSON.stringify(dataArray),
      {'encoding': 'utf8'}
    );

    return true;
  }
}

export default FilePersistence;
