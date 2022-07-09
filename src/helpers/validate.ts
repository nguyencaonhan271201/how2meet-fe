export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validateURL(url: string) {
  var regexQuery = "^(https?://)?(((www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z‌​0-9]{0,61}[a-z0-9]\\‌​.[a‌​-z]{2,6})|((\\d‌​{1,3}\\.){3}\\d{1,3}‌​))(:\\d{2,4})?((/|\\‌​?)[-\\w@\\+\\.~#\\?&‌​/=%]*)?$";
  var getURL = new RegExp(regexQuery, "i");
  return getURL.test(url);
}