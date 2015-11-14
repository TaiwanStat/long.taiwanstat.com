'use strict';

export function handleRain(data, rain) {
  let output = [];
  for(let i in rain) {
    for(let j in data) {
      if(rain[i].SiteName == data[j].station1StationName || rain[i].SiteName == data[j].station2StationName) {
        let check = true;
        for(let k in output) {
          if(output[k].SiteName == rain[i].SiteName) {
            check = false;
          }
        }

        if(check) {
          output.push(rain[i]);
        }
      }
    }
  }

  return output;
}

export function handleLine(data, line) {
  let temp = [...line.features];
  line.features.length = 0;
  for(let i in temp) {
    for(let j in data) {
      if(temp[i].properties.DEBRISNO == data[j].Debrisno || temp[i].properties.OLD == data[j].Debrisno) {
        let check = true;
        for(let k in line.features) {
          if(line.features[k].properties.DEBRISNO == temp[i].properties.DEBRISNO) { 
            check = false;
          }
        }

        if(check) {
          for(let k in data[j]) {
            temp[i].properties[k] = data[j][k];
          }
          line.features.push(temp[i]);
        }
      }
    }
  }
}
