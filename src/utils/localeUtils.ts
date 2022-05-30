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
  chooseImageOrStartWritting = 'Choose image or start typing...',
  version = 'Version',
  cpuUsage = 'CPU usage',
  cpu = 'CPU',
  time = 'Time',
  memory = 'Memory',
  memoryUsage = 'Memory usage',
  reporting = 'Reporting',
  report = 'Report',
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
  state = 'State',
  log = 'Log:',
  console = 'Console:',
  startedAt = 'Started at: ',
  finishedAt = 'Finished at: ',
  restartPolicy = 'Restart policy',
  restartCount = 'Restart count: ',
  maximumRetryCount = 'Maximum retry count: ',
  platform = 'Platform: ',
  workingDirectory = 'Working directory: ',
  volumes = 'Volumes: ',
  other = 'Other:',
  environment = 'Environment',
  network = 'Network',
  createDate = 'create date: ',
  statusWithTwoDots = 'Status: ',
  created2 = 'Created',
  running2 = 'Running',
  restarts = 'Restarts',
  exited2 = 'Exited',
  paused2 = 'Paused',
  dead2 = 'Dead',
  edit = 'Edit',
  notification = 'Notification',
  typeEmailAndPressEnter = 'Type or paste email addresses and press `Enter`...',
  hasAlreadyAdded = 'has already been added.',
  isNotValidEmail = 'is not a valid email address.',
  on = 'On',
  off = 'Off',
  eventDestroy = 'Event \'Destroy\'',
  eventDie = 'Event \'Die\'',
  eventKill = 'Event \'Kill\'',
  eventStart = 'Event \'Start\'',
  eventRestart = 'Event \'Restart\'',
  userManager = 'User manager',
  management = 'Management',
  users = 'Users',
  email = 'Email',
  password = 'Password',
  userEmail = 'User email',
  changeUserRole = 'Change user role',
  deleteUser = 'Delete user',
  admin = 'Admin',
  user = 'User',
  registration = 'Registration',
  empty = 'Empty',
  chooseContainerOrStartWritting = 'Choose container or start typing...',
  cpuUsageLimit = 'CPU usage limit',
  memoryUsageLimit = 'Memory usage limit',
  countRestart = 'Count restart',
  domainname = 'Domain name',
  hostname = 'Host name',
  update = 'Update',
  recreate = 'Recreate',
  healthCheckCommand = 'Health check command'
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
  report = 'Отчёт',
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
  state = 'Состояние',
  log = 'Журнал:',
  console = 'Консоль:',
  startedAt = 'Запущен в: ',
  finishedAt = 'Закончил в: ',
  restartPolicy = 'Политика перезагрузки',
  restartCount = 'Количество перезагрузок: ',
  maximumRetryCount = 'Максимальное количество перезагрузок: ',
  platform = 'Платформа: ',
  workingDirectory = 'Рабочая директория: ',
  volumes = 'Объёмы: ',
  other = 'Другое:',
  environment = 'Среда',
  network = 'Сеть',
  createDate = 'дата создания: ',
  statusWithTwoDots = 'Статус: ',
  created2 = 'Созданных',
  running2 = 'Запущенных',
  restarts = 'Перезапускающихся',
  exited2 = 'Завершённых',
  paused2 = 'Приостановленных',
  dead2 = 'Мёртвых',
  edit = 'Редактировать',
  notification = 'Оповещения',
  typeEmailAndPressEnter = 'Введите или вставьте email и нажмите `Enter`...',
  hasAlreadyAdded = 'уже добавлен.',
  isNotValidEmail = 'некорректный email',
  on = 'Вкл',
  off = 'Выкл',
  eventDestroy = 'Событие \'Destroy\'',
  eventDie = 'Событие \'Die\'',
  eventKill = 'Событие \'Kill\'',
  eventStart = 'Событие \'Start\'',
  eventRestart = 'Событие \'Restart\'',
  management = 'Управление',
  users = 'Пользователи',
  email = 'Электронная почта',
  password = 'Пароль',
  userEmail = 'Электронная почта пользователя',
  changeUserRole = 'Смена роли',
  deleteUser = 'Удалить пользователя',
  admin = 'Администратор',
  user = 'Пользователь',
  registration = 'Регистрация',
  empty = 'пусто',
  chooseContainerOrStartWritting = 'Выберите контейнер или начните вводить',
  cpuUsageLimit = 'Относительная нагрузка CPU',
  memoryUsageLimit = 'Лимит использования памяти',
  countRestart = 'Количество перезапусков',
  domainname = 'Доменное имя',
  hostname = 'Серверное имя',
  update = 'Обновить',
  recreate = 'Пересоздать',
  healthCheckCommand = 'Команда проверки работоспособности'
}
// Созданных
// Работающих
// Перезапускаются
// Завершённых
// Приостановленных
// Мёртвых
