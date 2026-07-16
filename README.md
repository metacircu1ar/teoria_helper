# Teoria Helper

[Русская версия](#русский)

Teoria Helper is an unofficial Chrome/Chromium extension for studying the driving-theory tickets on [teoria.on.ge](https://teoria.on.ge/). It adds concise answer help in Russian and English to ticket pages and exam mode.

## Features

- Covers all 1,810 tickets currently available on Teoria.on.ge (IDs 1–1811; ticket 1801 does not exist).
- Works across licence categories because tickets are matched by ticket ID.
- Shows the correct answer and a plain-language explanation from the bundled local database.
- In exam mode, detects the current shuffled position of the correct answer and keeps Russian replacement text aligned with the shuffled options.
- Uses Russian labels, answer text, and Russian plus English explanations when the website language is Russian. Other website languages receive English labels and explanations.
- Replaces the known untranslated Georgian ticket text with Russian text only when the website language is Russian.
- Flags six known source-ticket wording errors without modifying the original ticket shown by the website.
- Runs only on the Teoria ticket and exam pages. It has no analytics, advertising, accounts, remote code, or network requests.

## Install manually

Until the Chrome Web Store listing is published:

1. Download or clone this repository.
2. Open `chrome://extensions` in Chrome (or `edge://extensions` in Microsoft Edge).
3. Enable **Developer mode**.
4. Choose **Load unpacked** and select this repository's root directory.
5. Reload an already-open Teoria page.

The green `ANSWER` / `ОТВЕТ` button appears beside the ticket number while the ticket is hovered or keyboard-focused.

Chrome Web Store screenshots, promotional artwork, listing copy, and their source captures are kept in [`store-assets/`](store-assets/).

## Privacy and site access

Teoria Helper processes the current ticket ID, selected site language, and visible answer order locally so it can inject the helper interface. Nothing is collected, stored, or transmitted. See the bilingual [Privacy Policy](PRIVACY.md).

The extension requests no Chrome API permissions. Its content script is restricted to:

- `https://teoria.on.ge/tickets*`
- `https://teoria.on.ge/exam*`

## Disclaimer and licence

Teoria Helper is an independent study aid. It is not affiliated with or endorsed by Teoria.on.ge or Georgian authorities. Ticket content and traffic rules can change; verify important information against current official sources.

Original Teoria Helper software code and original explanatory text are available under the [MIT License](LICENSE). Other material remains subject to the rights of its respective owners.

---

## Русский

Teoria Helper — неофициальное расширение для Chrome/Chromium, которое помогает изучать экзаменационные билеты на [teoria.on.ge](https://teoria.on.ge/). Оно добавляет к билетам и режиму экзамена понятную справку на русском и английском.

## Возможности

- Охватывает все 1810 билетов, доступных сейчас на Teoria.on.ge (номера 1–1811; билета №1801 не существует).
- Работает во всех категориях прав, поскольку находит данные по номеру билета.
- Показывает правильный ответ и простое объяснение из встроенной локальной базы.
- В режиме экзамена определяет текущую позицию правильного ответа и сохраняет соответствие русского текста перемешанным вариантам.
- При русском языке сайта использует русские подписи, текст правильного ответа и объяснения на русском и английском. При других языках сайта показывает английские подписи и объяснение.
- Заменяет известный непереведённый грузинский текст билетов русским только при выбранном русском языке сайта.
- Предупреждает о шести известных ошибках в формулировках исходных билетов, не изменяя сам билет на сайте.
- Работает только на страницах билетов и экзамена Teoria. В расширении нет аналитики, рекламы, учётных записей, удалённого кода и сетевых запросов.

## Установка вручную

До публикации в Chrome Web Store:

1. Скачайте или клонируйте этот репозиторий.
2. Откройте `chrome://extensions` в Chrome (или `edge://extensions` в Microsoft Edge).
3. Включите **Режим разработчика**.
4. Нажмите **Загрузить распакованное расширение** и выберите корневую папку репозитория.
5. Обновите уже открытую страницу Teoria.

Зелёная кнопка `ОТВЕТ` / `ANSWER` появляется рядом с номером билета при наведении мыши или фокусе с клавиатуры.

Скриншоты, промоизображение, текст карточки Chrome Web Store и исходные снимки находятся в каталоге [`store-assets/`](store-assets/).

## Конфиденциальность и доступ к сайту

Teoria Helper локально считывает номер текущего билета, выбранный язык сайта и видимый порядок вариантов ответа, чтобы добавить интерфейс справки. Расширение ничего не собирает, не хранит и не передаёт. Подробности приведены в двуязычной [Политике конфиденциальности](PRIVACY.md).

Расширение не запрашивает разрешений Chrome API. Его скрипт работает только по адресам:

- `https://teoria.on.ge/tickets*`
- `https://teoria.on.ge/exam*`

## Отказ от ответственности и лицензия

Teoria Helper — независимое учебное дополнение. Оно не связано с Teoria.on.ge или государственными органами Грузии и не одобрено ими. Содержание билетов и правила дорожного движения могут меняться; важную информацию следует сверять с актуальными официальными источниками.

Оригинальный программный код и оригинальные пояснения Teoria Helper доступны по [лицензии MIT](LICENSE). Права на прочие материалы сохраняются за их соответствующими владельцами.
