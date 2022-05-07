import { GraphicsType } from 'enums/GraphicsType';

export const updateLocaleTitles = (
  chart: any,
  graphicType: GraphicsType,
  getLocalizedString: (key: string) => string,
) => {
  switch (graphicType) {
    case GraphicsType.CPU:
      updateConfigTitle(chart, getLocalizedString('cpu'));
      updateXAxisLabel(chart, getLocalizedString('time'));
      updateYAxisLabel(chart, getLocalizedString('cpuUsage'));
      break;
    case GraphicsType.Memory:
      updateConfigTitle(chart, getLocalizedString('memory'));
      updateXAxisLabel(chart, getLocalizedString('time'));
      updateYAxisLabel(chart, getLocalizedString('memoryUsage'));
      break;
  }
};

export const updateConfigTitle = (chart: any, title: string) => {
  chart.options.plugins.title.text = title;
  chart.update();
};

export const updateXAxisLabel = (chart: any, label: string) => {
  chart.options.scales.x.title.text = label;
  chart.update();
};

export const updateYAxisLabel = (chart: any, label: string) => {
  chart.options.scales.y.title.text = label;
  chart.update();
};
