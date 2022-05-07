export interface OptionType {
  label: string;
  value: string;
  description?: string;
}

export const searchAsyncSelectOptions = (inputValue: string, data: OptionType[]) => {
  return data.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
};

export const getOptionsFromArrayString = (array: string[]) => {
  return array.map((elem) => getOptionFromString(elem)) as OptionType[];
};

export const getOptionFromString = (value: string) => {
  return {
    label: value,
    value: value,
  } as OptionType;
};
