import React from 'react';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'handlers';
import { setSelectedContainers } from 'handlers/containersManager';

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
}

const Table = ({ headings, content }: TableProps) => {
  const dispatch = useDispatch();
  const { selectedContainers } = useSelector((state: RootState) => state.app.containersManager);

  return (
    <table className={'centered'}>
      <thead>
        <tr>
          <th>Selected</th>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((element: TableContent, index) => {
          element.created = new Date(+element.created * 1000).toString();
          return (
            <tr key={element.name + index}>
              <td>
                <label>
                  <input
                    id={element.Id}
                    type="checkbox"
                    onChange={(event) => {
                      if (event.target.checked) {
                        dispatch(setSelectedContainers([...selectedContainers, event.target.id]));
                      } else {
                        dispatch(setSelectedContainers([...selectedContainers.filter((id) => id !== event.target.id)]));
                      }
                    }}
                  />
                  <span></span>
                </label>
              </td>
              {headings.map((heading) => (
                <td key={element.name + index + heading}>{element[heading]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
