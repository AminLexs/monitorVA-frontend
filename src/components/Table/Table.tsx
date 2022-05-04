import React from 'react';
import { ContainerTableHeaders } from 'enums/ContainerTableHeaders';
import { ImageTableHeaders } from 'enums/ImageTableHeaders';

export interface ImageContent {
  name: string;
  version: string;
  size: string;
  created: string;
}

export interface ContainerContent {
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
  return (
    <table className={'centered'}>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {content.map((element: TableContent) => {
          element.created = new Date(+element.created * 1000).toString();
          return (
            <tr>
              {headings.map((heading) => (
                <td>{element[heading]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
