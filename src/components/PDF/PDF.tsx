import React, { Fragment } from 'react';
import { Page, Image, Text, View, Document as PDFDocument, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  section: {
    margin: 20,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    marginLeft: '30px',
    marginBottom: '20px',
    whiteSpace: 'pre-wrap',
  },
});

interface DocumentProps {
  chartURLs: string[];
  getLocalizedString: (key: string) => string;
  stats: any;
}

// Create Document Component
const Document = ({ chartURLs, getLocalizedString, stats }: DocumentProps) => {
  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {chartURLs.map((url, index) =>
            index === 0 ? (
              <Fragment key={index}>
                <Image src={url} />
                <Text style={styles.text}>
                  {getLocalizedString('created2')}:{stats.created}, {getLocalizedString('running2')}:{stats.running},{' '}
                  {getLocalizedString('exited2')}:{stats.exited}, {getLocalizedString('dead2')}:{stats.dead},{' '}
                  {getLocalizedString('restarts')}:{stats.restarting}, {getLocalizedString('paused2')}:{stats.paused},{' '}
                </Text>
              </Fragment>
            ) : (
              <Image key={index} src={url} />
            ),
          )}
        </View>
      </Page>
    </PDFDocument>
  );
};

export default Document;
