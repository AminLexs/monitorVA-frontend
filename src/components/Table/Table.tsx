import React, { useEffect, useState } from 'react';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import { useLocale } from 'utils/localeUtils';
import { getShortContainersID } from 'utils/stringUtils';
import clsx from 'clsx';

import styles from './Table.module.scss';

export interface ImageContent {
  Id: string;
  name: string;
  version: string;
  size: string;
  created: string;
}

export interface ContainerContent {
  Id: string;
  name: string;
  imageName: string;
  status: string;
  publicPort: string;
  privatePort: string;
  created: string;
}

type Heading = ContainerTableHeaders | ImageTableHeaders;
type TableContent = ImageContent | ContainerContent;

interface TableProps {
  headings: Heading[];
  content: TableContent[];
  onChange: (selectedItems: string[]) => void;
}

const Table = ({ headings, content, onChange }: TableProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const { getLocalizedString } = useLocale();

  const getFormattedValue = (rawValue: string, heading: string) => {
    switch (heading) {
      case ContainerTableHeaders.Created:
      case ImageTableHeaders.Created:
        return new Date(+rawValue * 1000).toString();
      case ContainerTableHeaders.Image:
        return rawValue.includes('sha256:')
          ? `${getLocalizedString('deleted')}(${getShortContainersID(rawValue.slice(7, rawValue.length))})`
          : rawValue;
      case ContainerTableHeaders.Status:
        return getLocalizedString(rawValue);
      default:
        return rawValue;
    }
  };
  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  return (
    <table className={'centered'}>
      <thead>
        <tr>
          <th>{getLocalizedString('selected')}</th>
          {headings.map((heading) => (
            <th key={heading}>{getLocalizedString(heading)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((element: TableContent, index) => {
          return (
            <tr key={element.name + index}>
              <td>
                <label>
                  <input
                    id={element.Id}
                    type="checkbox"
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedItems([...selectedItems, event.target.id]);
                      } else {
                        setSelectedItems([...selectedItems.filter((id) => id !== event.target.id)]);
                      }
                    }}
                  />
                  <span style={{ padding: '10px' }} />
                </label>
              </td>
              {headings.map((heading) => (
                <td
                  key={element.name + index + heading}
                  className={
                    heading === ContainerTableHeaders.Status
                      ? clsx(
                          element[heading] === 'running' && styles.statusRunning,
                          element[heading] === 'exited' && styles.statusExited,
                        )
                      : undefined
                  }
                >
                  {getFormattedValue(element[heading], heading)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
