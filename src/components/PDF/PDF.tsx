import React, { Fragment } from 'react';
import { Page, Image, Text, View, Document as PDFDocument, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'RobotoBold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});
Font.register({
  family: 'Sans',
  src: 'https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf',
})
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
  sectionGraphics: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontFamily: 'RobotoBold',
    fontSize: '21px',
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Sans',
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

const MOCK_CONTAINERTS_DATA = [
  {
    name:'lag',
    info: '\nСостояние\n' +
        'Статус: exited\n' +
        'PID: 0\n' +
        'Запущен в: 2022-05-15T00:24:23.2104558Z\n' +
        'Закончил в: 2022-05-15T00:24:33.8092206ZПолитика перезагрузки\n' +
        'Политика перезагрузки\n' +
        'Количество перезагрузок: 0\n' +
        'Среда\n' +
        'Платформа: linux\n' +
        'Рабочая директория: /usr/src/app\n' +
        'Образ: lagservermod\n' +
        'Объёмы: null\n' +
        'Другое:\n' +
        'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n' +
        'NODE_VERSION=12.22.5\n' +
        'YARN_VERSION=1.22.5\n' +
        'Сеть\n' +
        'Публичный порт: 3000/tcp\n' +
        'Приватный порт: 600'
  },
  {
    name:'lagsservmod',
    info: '\nСостояние\n' +
        'Статус: exited\n' +
        'PID: 0\n' +
        'Запущен в: 2022-05-15T00:24:23.2104558Z\n' +
        'Закончил в: 2022-05-15T00:24:33.8092206ZПолитика перезагрузки\n' +
        'Политика перезагрузки\n' +
        'Количество перезагрузок: 0\n' +
        'Среда\n' +
        'Платформа: linux\n' +
        'Рабочая директория: /usr/src/app\n' +
        'Образ: lagservermod\n' +
        'Объёмы: null\n' +
        'Другое:\n' +
        'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n' +
        'NODE_VERSION=12.22.5\n' +
        'YARN_VERSION=1.22.5\n' +
        'Сеть\n' +
        'Публичный порт: 3000/tcp\n' +
        'Приватный порт: 600'
  }
]

const MOCK_MEMORY_URL = 'https://image-charts.com/chart.js/2.8.0?chart=%7Btype%3A%27bar%27%2Cdata%3A%7Blabels%3A%5B%27%D0%91%D0%B0%D0%B9%D1%82%27%5D%2Cdatasets%3A%5B%7Blabel%3A%27Used+memory%27%2Cdata%3A%5B400000%5D%7D%2C%7Blabel%3A%27Empty+memory%27%2Cdata%3A%5B2\n' +
    '00000%5D%2CbackgroundColor%3A%27%23D3D3D3%27%7D%5D%7D%2Coptions%3A%7Btitle%3A%7Bdisplay%3Atrue%2Ctext%3A%27History+stats%27%7D%2Cresponsive%3Atrue%2Cscales%3A%7BxAxes%3A%5B%7Bstacked%3Atrue%7D%5D%2CyAxes%3A%5B%7Bstacked%3Atrue%2Cticks%3A%7\n' +
    'BbeginAtZero%3Atrue%2Cmin%3A0%2Cmax%3A1000000%7D%7D%5D%7D%7D%7D&backgroundColor=white&width=500&height=300'


// Create Document Component
const Document = ({ chartURLs, getLocalizedString, stats }: DocumentProps) => {
  return (
    <PDFDocument>
      {MOCK_CONTAINERTS_DATA.map(containerData=>{
        return(
            <Page key={containerData.name} size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.header}>{containerData.name}</Text>
                <Text style={styles.text}>
                  {containerData.info}
                </Text>
                <View style={styles.sectionGraphics}>
                  <Image style={{ width:250, height:150 }}  src={MOCK_MEMORY_URL} />
                  <Image style={{ width:250, height:150 }}  src={MOCK_MEMORY_URL} />
                </View>
                </View>
            </Page>
          )
      })}
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
