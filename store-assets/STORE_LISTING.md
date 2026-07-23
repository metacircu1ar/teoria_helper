# Teoria Helper — Chrome Web Store publication copy

Use the English text for the default listing and add Russian as a localized listing in the Chrome Web Store dashboard.

## English listing

### Name

Teoria Helper

### Short description

Adds correct answers and clear Russian and English explanations to Teoria.on.ge practice tickets and exam mode.

### Detailed description

Teoria Helper is an unofficial study aid for the driving-theory practice pages on Teoria.on.ge.

The extension:

- adds an `ANSWER` / `ОТВЕТ` button to practice tickets and exam mode;
- shows the correct answer with a clear explanation;
- provides English explanations and, when the site is in Russian, Russian explanations as well;
- covers all 1,810 available ticket numbers across every licence category;
- follows shuffled answer positions in exam mode, so the displayed answer number and Russian replacement text stay aligned with the current screen;
- shows prominent notes for six known ticket wording errors;
- provides Russian text for tickets that remain Georgian when Teoria's Russian language is selected;
- leaves Teoria's original `?` explanation button unchanged.

All processing happens locally in the browser. Teoria Helper has no accounts, analytics, advertising, tracking, or remote code. It does not collect, store, sell, or transmit personal data.

Teoria Helper is an independent, unofficial project. It is not affiliated with, endorsed by, or produced by Teoria.on.ge.

## Русская карточка

### Название

Teoria Helper

### Краткое описание

Добавляет правильные ответы и понятные объяснения на русском и английском к билетам и экзамену Teoria.on.ge.

### Полное описание

Teoria Helper — неофициальный помощник для изучения теории в билетах и режиме экзамена на Teoria.on.ge.

Расширение:

- добавляет кнопку `ОТВЕТ` / `ANSWER` к билетам и вопросам в режиме экзамена;
- показывает правильный ответ и объясняет его простым языком;
- всегда показывает объяснение на английском, а при русском языке сайта — также на русском;
- охватывает все 1810 доступных номеров билетов во всех категориях водительских прав;
- учитывает перемешивание вариантов в режиме экзамена, поэтому номер ответа и подставленный русский текст соответствуют текущим позициям на экране;
- показывает заметные предупреждения для шести известных ошибок в формулировках билетов;
- подставляет русский текст для билетов, которые остаются на грузинском при выбранном русском языке Teoria;
- не изменяет работу штатной кнопки `?` с объяснением Teoria.

Вся обработка выполняется локально в браузере. В Teoria Helper нет аккаунтов, аналитики, рекламы, отслеживания или удалённого кода. Расширение не собирает, не хранит, не продаёт и не передаёт персональные данные.

Teoria Helper — независимый неофициальный проект. Он не связан с Teoria.on.ge, не одобрен и не создан этим сайтом.

## Recommended store settings

- Category: `Education`
- Default listing language: `English`
- Additional localized listing: `Russian`
- Visibility for release: choose `Public` only after final manual verification; `Unlisted` or `Private` can be used for an initial reviewed test release.
- Paid product: `No`
- Contains ads: `No`

## Privacy practices — ready-to-paste declarations

### Single purpose — English

Teoria Helper adds correct answers and clear Russian and English explanations to driving-theory practice tickets and exam questions on Teoria.on.ge.

### Единственная цель — русский

Teoria Helper добавляет правильные ответы и понятные объяснения на русском и английском к учебным билетам и вопросам режима экзамена на Teoria.on.ge.

### Site access justification — English

The extension runs only on Teoria.on.ge ticket and exam pages. It needs access to the page to read the visible ticket number, selected site language, and current answer ordering, and to insert the Answer button and explanation dialog. This information is processed locally and is never stored or transmitted.

### Обоснование доступа к сайту — русский

Расширение работает только на страницах билетов и экзамена Teoria.on.ge. Доступ к странице нужен, чтобы локально прочитать видимый номер билета, выбранный язык сайта и текущий порядок вариантов, а затем добавить кнопку ответа и окно с объяснением. Эти сведения не сохраняются и никуда не передаются.

### Data-use declaration

Declare `Website content` because the extension locally reads the ticket page needed for its user-facing function.

- Purpose: `App functionality`
- Processing: on-device only
- Stored: no
- Transmitted: no
- Shared or sold: no
- Used for advertising, profiling, creditworthiness, or unrelated purposes: no
- Human access to user data: no
- Authentication, personal communications, location, financial, health, or personally identifiable data: none

Pasteable explanation:

> Teoria Helper processes only the Teoria.on.ge page content required to identify the current practice ticket, site language, and displayed answer order. Processing occurs entirely on the user's device. No website content or personal data is collected, retained, transmitted, shared, or sold.

### Remote code

Select: `No, I am not using remote code.`

Pasteable explanation if the dashboard requests one:

> All executable code and ticket-help data are included in the extension package. The extension neither downloads nor executes remote code.

### Privacy policy URL

`https://github.com/metacircu1ar/teoria_helper/blob/main/PRIVACY.md`

Confirm that this URL is public and opens without authentication before submission.

## Reviewer test instructions

No account or test credentials are required.

1. Install the extension and open `https://teoria.on.ge/tickets/2`.
2. Select Russian on the site, hover over a ticket, and click `ОТВЕТ`.
3. Confirm that the answer dialog shows the correct answer and Russian and English explanations.
4. Close the dialog and move the pointer outside the ticket. The helper buttons should disappear, matching the site's `?` button behavior.
5. Change the site language away from Russian. The button should read `ANSWER`, and the dialog should show the answer number and English explanation.
6. Open `https://teoria.on.ge/exam`, start a practice exam, hover over the displayed question, and click the helper button.
7. Confirm that the answer number matches the option's current shuffled position on the exam screen.
8. Confirm that Teoria's original `?` button continues to open Teoria's own explanation.

## Mandatory image and package specifications

### Prepared upload assets

- `global-screenshot-popup-1280x800.png` — global English screenshot showing the complete answer dialog.
- `global-screenshot-ticket-1280x800.png` — global English ticket screenshot showing the `ANSWER` button, native `?` button, question, and complete answer panels.
- `screenshot-popup-1280x800.png` — localized Russian screenshot showing the complete answer dialog.
- `screenshot-ticket-1280x800.png` — localized Russian ticket screenshot showing the `ОТВЕТ` button, native `?` button, question, and complete answer panels. Narrow white side margins match the website background and preserve the entire ticket vertically.
- `small-promo-440x280.png` — required locale-neutral promotional image.

The uncropped source captures are kept in `source/` and are not part of the extension ZIP. The current upload ZIP is stored at `release/teoria-helper-1.1.0.zip` and committed to Git as the release artifact for version `1.1.0`.

### Extension icon

- A `128x128` PNG must be inside the uploaded extension ZIP and referenced by `manifest.json`.
- Also include `16x16`, `32x32`, and `48x48` PNG variants for browser UI.
- The artwork must be original and visually distinct from the Teoria.on.ge logo.

### Screenshot

- At least one screenshot is mandatory.
- Required size: `1280x800` or `640x400`; prefer `1280x800`.
- Use square corners, full bleed, and no added padding.
- Show the actual extension experience clearly—ideally a Teoria ticket with the helper buttons and open answer dialog.
- Up to five localized screenshots may be supplied. Useful additional views are Russian ticket mode, English ticket mode, exam mode, and a correction warning.

### Small promotional image

- One `440x280` promotional image is mandatory.
- Avoid dense text; it is not locale-specific and should remain understandable at a small size.

### ZIP package

- `manifest.json` must be at the ZIP root, not inside a containing folder.
- Include only runtime files, icons, locales, and publication documents.
- Exclude `.git`, `.DS_Store`, development scripts, tests, downloaded pages, and intermediate data.
- Do a final unpacked-extension test using exactly the files that will be zipped.

## Manual release checklist

- [ ] `manifest.json` parses and still uses Manifest V3.
- [ ] Version is `1.1.0`.
- [ ] Manifest name and descriptions render correctly in both English and Russian Chrome locales.
- [ ] Every icon path exists and each PNG has the declared dimensions.
- [ ] The extension requests no unnecessary permissions.
- [ ] There are no network requests, analytics, advertisements, remote scripts, or dynamically downloaded code.
- [ ] Normal ticket mode works in Russian and a non-Russian site language.
- [ ] Exam mode reports the current shuffled answer number and keeps Russian replacement text aligned with shuffled options.
- [ ] Error notices work for tickets `275`, `326`, `1013`, `1136`, `1718`, and `1719`.
- [ ] Georgian-to-Russian replacement is applied only while the site language is Russian.
- [ ] Teoria's original `?` behavior is unchanged.
- [ ] Helper buttons disappear after the pointer leaves the ticket and a dialog is closed.
- [ ] The public privacy-policy URL works without authentication.
- [ ] README, privacy policy, licence, and unofficial-project disclaimer are present and accurate.
- [ ] Distribution, content rating, privacy practices, and listing fields are complete.
- [ ] At least one valid screenshot and the `440x280` promotional image are uploaded.
- [ ] The final ZIP contains `manifest.json` at its root and no repository/development files.
- [ ] Two-step verification is enabled on the publishing Google account; Chrome Web Store requires it for publication and updates.
- [ ] Final reviewer instructions are pasted into the dashboard before submission.
