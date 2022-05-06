export interface OptionType {
  label: string;
  value: string;
}

export const searchAsyncSelectOptions = (inputValue: string, data: OptionType[]) => {
  return data.filter((i) => i.label.toLowerCase().includes(inputValue.toLowerCase()));
};
