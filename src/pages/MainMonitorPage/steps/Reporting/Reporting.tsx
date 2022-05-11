import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import MyDocument from 'components/PDF/PDF';

const Reporting = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PDFViewer height={'700px'}>
        <MyDocument />
      </PDFViewer>
    </div>
  );
};

export default Reporting;
