export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function intFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}