import React, { useEffect, useState } from 'react';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import { useLocale } from 'utils/localeUtils';
import { getShortContainersID } from 'utils/stringUtils';
import clsx from 'clsx';
import { searchNameFunc, sortTable } from 'utils/tableUtils';
import { setCurrentContainerID } from 'handlers/containersManager';
import { setDashboardStep } from 'handlers/stages';
import { useDispatch } from 'react-redux';
import { DashboardStep } from 'enums/DashboardStep';
import { getHumanBytes } from 'utils/dataFormattingUtils';
import { TableType } from 'enums/TableType';

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
  tableType: TableType;
  onChange: (selectedItems: string[]) => void;
}

const renderHeadingContent = (text: string, indexHeading: number) => {
  const [arrowUp, setArrowUp] = useState(false);

  const handleOnClick = () => {
    setArrowUp((prev) => !prev);
    sortTable(indexHeading, !arrowUp);
  };

  return (
    <div className={styles.heading} onClick={handleOnClick}>
      <div className={styles.text}>{text}</div>
      <i className="material-icons">{arrowUp ? 'arrow_upward' : 'arrow_downward'}</i>
    </div>
  );
};

const Table = ({ headings, content, tableType, onChange }: TableProps) => {
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const { getLocalizedString, locale } = useLocale();
  const dispatch = useDispatch();

  const getFormattedValue = (rawValue: string, heading: string) => {
    switch (heading) {
      case ContainerTableHeaders.Created:
      case ImageTableHeaders.Created:
        return new Date(+rawValue * 1000).toLocaleString(locale);
      case ContainerTableHeaders.Image:
        return rawValue.includes('sha256:')
          ? `${getLocalizedString('deleted')}(${getShortContainersID(rawValue.slice(7, rawValue.length))})`
          : rawValue;
      case ContainerTableHeaders.Status:
        return getLocalizedString(rawValue);

      case ImageTableHeaders.Size:
        return getHumanBytes(+rawValue);

      default:
        return rawValue;
    }
  };
  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

  const handleOnClickRow = (id: string) => {
    dispatch(setCurrentContainerID(id));
    dispatch(setDashboardStep(DashboardStep.DetailContainer));
  };

  return (
    <div>
      <div style={{ width: '50%' }} className="input-field right">
        <i className="material-icons prefix">search</i>
        <input placeholder={getLocalizedString('startTypingName')} id="searchInput" onKeyUp={() => searchNameFunc()} />
      </div>

      <table style={{ borderTop: '1px solid grey' }} id="table" className={'centered highlight'}>
        <thead>
          <tr>
            <th>{getLocalizedString('selected')}</th>
            {headings.map((heading, index) => (
              <th key={heading}>{renderHeadingContent(getLocalizedString(heading), index + 1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.map((element: TableContent, index) => {
            return (
              <tr key={element.name + index} className={styles.trBodyTable}>
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
                    onClick={() => {
                      if (tableType === TableType.ContainerTable) handleOnClickRow(getShortContainersID(element.Id));
                    }}
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
    </div>
  );
};

export default Table;
