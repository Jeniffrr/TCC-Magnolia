export const applyCpfMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export const applyPhoneMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

export const applyCepMask = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};