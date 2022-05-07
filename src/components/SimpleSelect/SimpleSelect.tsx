import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { OptionType } from 'utils/selectUtils';
import { useLocale } from 'utils/localeUtils';

interface SimpleSelectProps {
  options: OptionType[];
  onChange: (event: SingleValue<OptionType>) => void;
  firstValue?: OptionType;
}

const SimpleSelect = ({ onChange, options, firstValue }: SimpleSelectProps) => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<OptionType>();
  const { getLocalizedString } = useLocale();
  const handleOnChange = (event: any) => {
    setValue(event);
    onChange(event);
  };
  const getLocalizedOptionType = (optionType: OptionType) =>
    ({ label: getLocalizedString(optionType.value), value: optionType.value } as OptionType);

  return (
    <Select
      menuPlacement="top"
      onChange={handleOnChange}
      onMenuClose={() => {}}
      onInputChange={(input) => {
        setInputValue(input);
      }}
      value={value ? (getLocalizedOptionType(value) as OptionType) : firstValue}
      inputValue={inputValue}
      onMenuOpen={() => {}}
      options={options.map((option) => getLocalizedOptionType(option))}
    />
  );
};

export default SimpleSelect;
