import React, { Fragment } from 'react';
import { Page, Image, Text, View, Document as PDFDocument, StyleSheet, Font } from '@react-pdf/renderer';
import { getDateFromString } from 'utils/stringUtils';

Font.register({
  family: 'RobotoBold',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
});
Font.register({
  family: 'Sans',
  src: 'https://fonts.gstatic.com/s/sourcesanspro/v14/6xK3dSBYKcSV-LCoeQqfX1RYOo3aPw.ttf',
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
  sectionGraphics: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chart: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '5px',
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

interface ContainerInfo {
  name: string;
  containerInfo?: any;
  cpuChartURL?: string;
  memoryChartURL?: string;
  usageMemory?: string;
  freeMemory?: string;
  usageCpu?: string;
}

interface DocumentProps {
  containersInfo: ContainerInfo[];
  doughnutChartNowStateURL: string;
  barChartHistoryStateStatsURL: string;
  getLocalizedString: (key: string) => string;
  stats: any;
}

const getUsefulInformation = (containerInfo: any, getLocalizedString: (key: string) => string) => {
  const result =
    `${getLocalizedString('state')}\n` +
    `${getLocalizedString('status')}: ${getLocalizedString(containerInfo.State.Status)}\n` +
    `PID: ${containerInfo.State.Pid}\n` +
    `${getLocalizedString('startedAt')} ${getDateFromString(containerInfo.State.StartedAt)}\n` +
    `${getLocalizedString('finishedAt')} ${getDateFromString(containerInfo.State.FinishedAt)}\n` +
    `\n${getLocalizedString('restartPolicy')}\n` +
    `${getLocalizedString('countRestart')}:  ${containerInfo.RestartCount}\n` +
    `${getLocalizedString('maximumRetryCount')}${containerInfo.HostConfig.RestartPolicy.MaximumRetryCount}\n` +
    `\n${getLocalizedString('environment')}\n` +
    `${getLocalizedString('platform')}  ${containerInfo.Platform}\n` +
    `${getLocalizedString('workingDirectory')} ${containerInfo.Config.WorkingDir}\n` +
    `${getLocalizedString('image')}: ${containerInfo.Config.Image}\n` +
    `${getLocalizedString('volumes')} ${containerInfo.Config.Volumes ?? getLocalizedString('empty')}\n` +
    `${getLocalizedString('other')}\n` +
    `${(containerInfo.Config.Env as Array<any>).map((elem) => `${elem} \n`).join('')}` +
    `\n${getLocalizedString('network')}\n` +
    `${getLocalizedString('publicPort')}: ${Object.keys(containerInfo.HostConfig.PortBindings)[0]}\n` +
    `${getLocalizedString('privatePort')}: ${
      (Object.values(containerInfo.HostConfig.PortBindings)[0] as Array<any>)[0].HostPort
    }`;

  return result;
};

// Create Document Component
const Document = ({
  containersInfo,
  doughnutChartNowStateURL,
  barChartHistoryStateStatsURL,
  getLocalizedString,
  stats,
}: DocumentProps) => {
  return (
    <PDFDocument>
      {containersInfo.map((containerData) => {
        return (
          <Page key={containerData.name} size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text style={styles.header}>{containerData.name}</Text>
              {containerData.containerInfo && (
                <Text style={styles.text}>{getUsefulInformation(containerData.containerInfo, getLocalizedString)}</Text>
              )}
              {(containerData.cpuChartURL || containerData.memoryChartURL) && (
                <View style={styles.sectionGraphics}>
                  {containerData.cpuChartURL && (
                    <View style={styles.chart}>
                      <Image style={{ width: 250, height: 150 }} src={containerData.cpuChartURL} />
                      {containerData.usageMemory && (
                        <Text style={styles.text}>
                          {getLocalizedString('cpuUsage') + ': ' + containerData.usageCpu + '%'}
                        </Text>
                      )}
                    </View>
                  )}
                  {containerData.memoryChartURL && (
                    <View style={styles.chart}>
                      <Image style={{ width: 250, height: 150 }} src={containerData.memoryChartURL} />
                      {containerData.usageMemory && (
                        <Text style={styles.text}>
                          {getLocalizedString('usageMemory') + containerData.usageMemory + getLocalizedString('mb')}
                        </Text>
                      )}
                      {containerData.freeMemory && (
                        <Text style={styles.text}>
                          {getLocalizedString('freeMemory') + containerData.freeMemory + getLocalizedString('mb')}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          </Page>
        );
      })}
      {(doughnutChartNowStateURL || barChartHistoryStateStatsURL) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {doughnutChartNowStateURL ? (
              <Fragment>
                <Image src={doughnutChartNowStateURL} />
                <Text style={styles.text}>
                  {getLocalizedString('created2')}:{stats.created}, {getLocalizedString('running2')}:{stats.running},{' '}
                  {getLocalizedString('exited2')}:{stats.exited}, {getLocalizedString('dead2')}:{stats.dead},{' '}
                  {getLocalizedString('restarts')}:{stats.restarting}, {getLocalizedString('paused2')}:{stats.paused},{' '}
                </Text>
              </Fragment>
            ) : null}
            {barChartHistoryStateStatsURL ? <Image src={barChartHistoryStateStatsURL} /> : null}
          </View>
        </Page>
      )}
    </PDFDocument>
  );
};

export default Document;
