import { Locale } from 'enums/Locale';
import { useSelector } from 'react-redux';
import { RootState } from 'handlers';

export const useLocale = () => {
  const { locale } = useSelector((state: RootState) => state.app.ui);

  return { getLocalizedString: getLocalizedString(locale), locale };
};

const getLocalizedString = (locale: Locale) => {
  return (key: string) => {
    switch (locale) {
      case Locale.En:
        return EnglishLocale[key] as string;
      case Locale.Ru:
        return RussianLocale[key] as string;
    }
  };
};

enum EnglishLocale {
  russian = 'Russian',
  english = 'English',
  logOut = 'Log out',
  selected = 'Selected',
  name = 'Name',
  image = 'Image',
  status = 'Status',
  publicPort = 'Public port',
  privatePort = 'Private port',
  list = 'List',
  monitoring = 'Monitoring',
  images = 'Images',
  containers = 'Containers',
  startContainer = 'Start container',
  stopContainer = 'Stop container',
  addContainer = 'Add container',
  deleteContainer = 'Delete container',
  restartContainer = 'Restart container',
  pauseContainer = 'Pause container',
  unpauseContainer = 'Unpause container',
  containerName = 'Container name',
  create = 'Create',
  save = 'Save',
  imageName = 'Image name',
  size = 'Size',
  created = 'Created',
  deleted = 'Deleted',
  running = 'Running',
  restarting = 'Restarting',
  exited = 'Exited',
  paused = 'Paused',
  dead = 'Dead',
  addImage = 'Add image',
  deleteImage = 'Delete image',
  chooseImageOrStartWritting = 'Choose image or start typing',
  version = 'Version',
  cpuUsage = 'CPU usage',
  cpu = 'CPU',
  time = 'Time',
  memory = 'Memory',
  memoryUsage = 'Memory usage',
  reporting = 'Reporting',
  run = 'Run',
  pause = 'Pause',
  seconds = 'Seconds',
  requestFrequency = 'Request frequency',
  byte = 'Byte',
  kilobyte = 'Kilobyte',
  megabyte = 'Megabyte',
  gigabyte = 'Gigabyte',
  terabyte = 'Terabyte',
  startTypingName = 'Start typing name...',
}

enum RussianLocale {
  russian = 'Русский',
  english = 'Английский',
  logOut = 'Выйти',
  selected = 'Выбор',
  name = 'Имя',
  image = 'Образ',
  status = 'Статус',
  publicPort = 'Публичный порт',
  privatePort = 'Приватный порт',
  list = 'Список',
  monitoring = 'Мониторинг',
  images = 'Образы',
  containers = 'Контейнеры',
  startContainer = 'Запустить контейнер',
  stopContainer = 'Остановить контейнер',
  addContainer = 'Добавить контейнер',
  deleteContainer = 'Удалить контейнер',
  restartContainer = 'Перезагрузить контейнер',
  pauseContainer = 'Приостановить контейнер',
  unpauseContainer = 'Возобновить контейнер',
  containerName = 'Имя контейнера',
  create = 'Создать',
  save = 'Сохранить',
  imageName = 'Имя образа',
  size = 'Размер',
  created = 'Создан',
  deleted = 'Удалён',
  running = 'Запущен',
  restarting = 'Перезапуск',
  exited = 'Завершён',
  paused = 'Приостановлен',
  dead = 'Мёртв',
  addImage = 'Добавить образ',
  deleteImage = 'Удалить образ',
  chooseImageOrStartWritting = 'Выберите образ или начните вводить',
  version = 'Версия',
  cpuUsage = 'Использование ЦП',
  cpu = 'ЦП',
  time = 'Время',
  memory = 'Оперативная память',
  memoryUsage = 'Использование памяти',
  reporting = 'Отчётность',
  run = 'Запустить',
  pause = 'Приостановить',
  seconds = 'Секунды',
  requestFrequency = 'Частота запроса:',
  byte = 'Байт',
  kilobyte = 'Килобайт',
  megabyte = 'Мегабайт',
  gigabyte = 'Гигабайт',
  terabyte = 'Терабайт',
  startTypingName = 'Начните вводить имя...',
}
