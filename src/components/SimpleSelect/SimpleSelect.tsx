import React, { useState } from 'react';
import Select, { MenuPlacement, SingleValue } from 'react-select';
import { OptionType } from 'utils/selectUtils';
import { useLocale } from 'utils/localeUtils';

interface SimpleSelectProps {
  options: OptionType[];
  onChange: (event: SingleValue<OptionType>) => void;
  firstValue?: OptionType;
  menuPlacement?: MenuPlacement;
}

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    display: 'inline-block',
    width: '250px',
    minHeight: '1px',
    textAlign: 'left',
    border: 'none',
  }),
  control: (provided: any) => ({
    ...provided,
    border: '2px solid #757575',
    borderRadius: '0',
    minHeight: '1px',
    height: '42px',
  }),
  input: (provided: any) => ({
    ...provided,
    minHeight: '1px',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    minHeight: '1px',
    paddingTop: '0',
    paddingBottom: '0',
    color: '#757575',
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    minHeight: '1px',
    height: '24px',
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    minHeight: '1px',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    minHeight: '1px',
    height: '40px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    minHeight: '1px',
    paddingBottom: '2px',
  }),
};

const SimpleSelect = ({ onChange, options, firstValue, menuPlacement = 'top' }: SimpleSelectProps) => {
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
      styles={customStyles}
      menuPlacement={menuPlacement}
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
