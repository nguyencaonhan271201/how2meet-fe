export const encrypt = (password: string) => {
  let result = "";
  let tmpKey = 0;
  for (let i = 0; i < password.length; i++) {
    result += String(password[i].charCodeAt(0) + tmpKey++).padStart(3, '0');
  }
  return result;
}

export const decrypt = (password: string) => {
  let tmpKey = 0;
  let result = "";
  for (let i = 0; i < password.length; i += 3) {
    let getString = password.substring(i, i + 3);
    let getAscii = parseInt(getString) - tmpKey++;
    result += String.fromCharCode(getAscii);
  }
  return result;
}