import validator from 'validator';

export function Logger(msg) {
  console.log(`[LOG] ${msg}`);
}

export function IsValidUrl(url) {
  return validator.isURL(url);
}
