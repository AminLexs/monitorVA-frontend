const kilobyte = 1024;
const megabyte = kilobyte * 1024;
const gigabyte = megabyte * 1024;
const terabyte = gigabyte * 1024;

export const getHumanBytes = (bytes: number, precision = 2) => {
  if (bytes >= 0 && bytes < kilobyte) {
    return bytes + ' B';
  } else if (bytes >= kilobyte && bytes < megabyte) {
    return (bytes / kilobyte).toFixed(precision) + ' KB';
  } else if (bytes >= megabyte && bytes < gigabyte) {
    return (bytes / megabyte).toFixed(precision) + ' MB';
  } else if (bytes >= gigabyte && bytes < terabyte) {
    return (bytes / gigabyte).toFixed(precision) + ' GB';
  } else if (bytes >= terabyte) {
    return (bytes / terabyte).toFixed(precision) + ' TB';
  } else {
    return bytes + ' B';
  }
};

export const bytesToKilobytes = (bytes: number, precision = 2) => {
  return (bytes / kilobyte).toFixed(precision);
};

export const bytesToMegabytes = (bytes: number, precision = 2) => {
  return (bytes / megabyte).toFixed(precision);
};

export const bytesToGigabytes = (bytes: number, precision = 2) => {
  return (bytes / gigabyte).toFixed(precision);
};

export const bytesToTerabytes = (bytes: number, precision = 2) => {
  return (bytes / terabyte).toFixed(precision);
};

// export default {getHumanBytes, bytesToKilobytes,
//     bytesToMegabytes, bytesToGigabytes, bytesToTerabytes
// }
