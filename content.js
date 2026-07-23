(() => {
  "use strict";

  const TICKETS = globalThis.TEORIA_TICKET_DATA || {};
  const CHEAT_SHEETS = globalThis.TEORIA_CHEAT_SHEETS || {};
  const MODAL_ID = "teoria-helper-modal-layer";
  const EXAM_SHORTCUT_KEYS = new Set(["Escape", "Enter", " ", "1", "2", "3", "4"]);
  let previousFocus = null;
  const suppressedExamKeyups = new Set();

  function isExamPage() {
    return location.pathname === "/exam" || Boolean(document.querySelector(".exam-global-wrap .questions-running-wrapper #question"));
  }

  function getTicketContainers() {
    if (isExamPage()) return document.querySelectorAll("#question > .ticket-container");
    return document.querySelectorAll(".ticket-container");
  }

  function getTicketId(ticket) {
    if (!ticket) return null;

    const articleId = ticket.id.match(/^ticket-(\d+)$/);
    if (articleId) return articleId[1];

    const numberText = ticket.querySelector(".t-num")?.textContent || "";
    const numberMatch = numberText.match(/\d+/);
    if (numberMatch) return numberMatch[0];

    const link = ticket.querySelector('.ticket-page-link[href*="ticket="], .ticket-link-input[value*="ticket="]');
    const rawUrl = link?.getAttribute("href") || link?.getAttribute("value");
    if (!rawUrl) return null;

    try {
      return new URL(rawUrl, location.href).searchParams.get("ticket");
    } catch {
      return null;
    }
  }

  function getSiteLanguage(ticket = null) {
    const localeClass = [...(ticket?.classList || [])].find((className) => /^locale-[a-z-]+$/i.test(className));
    if (localeClass) return localeClass.slice("locale-".length).toLowerCase();

    const activeLanguage = document.querySelector(".settings-lang .a-2.active[data-value]")?.dataset.value;
    if (activeLanguage) return activeLanguage.trim().toLowerCase();

    const currentLanguage = document.querySelector(".settings-lang .current-lang .lang-name")?.textContent;
    if (currentLanguage?.trim()) return currentLanguage.trim().toLowerCase();

    const currentFlag = [...(document.querySelector(".settings-lang .current-lang .flag")?.classList || [])]
      .find((className) => className !== "flag");
    return currentFlag?.toLowerCase() || "";
  }

  function localizedText(table, language) {
    const value = table?.[language];
    return typeof value === "string" ? value : "";
  }

  function localizedRecord(table, language) {
    const value = table?.[language];
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function renderCheatSheets(container, cheatSheetIds, language) {
    container.replaceChildren();
    const ids = Array.isArray(cheatSheetIds) ? cheatSheetIds : [];

    for (const id of ids) {
      const cheatSheet = CHEAT_SHEETS[id];
      const label = localizedText(cheatSheet?.label, language);
      const text = localizedText(cheatSheet?.text, language);
      if (!label || !text) continue;

      const block = document.createElement("section");
      block.className = "teoria-helper-modal__cheat-sheet";
      block.setAttribute("role", "note");
      block.lang = language;

      const heading = document.createElement("strong");
      heading.className = "teoria-helper-modal__cheat-sheet-label";
      heading.textContent = label;

      const body = document.createElement("p");
      body.className = "teoria-helper-modal__cheat-sheet-text";
      body.textContent = text;

      block.append(heading, body);
      container.append(block);
    }

    container.hidden = container.childElementCount === 0;
  }

  function normalizeAnswerIdentity(value) {
    return String(value || "")
      .normalize("NFKC")
      .replace(/[\u00ad\u200b-\u200d\u2060\ufeff]/g, "")
      .replace(/\s+/gu, " ")
      .trim();
  }

  function getAnswerNumber(answer) {
    const numberClass = [...(answer?.classList || [])].find((className) => /^t-answer-\d+$/.test(className));
    if (numberClass) return numberClass.slice("t-answer-".length);

    const visibleNumber = answer?.querySelector(".t-a-num")?.textContent.trim() || "";
    return /^\d+$/.test(visibleNumber) ? visibleNumber : "";
  }

  function getExamAnswerNumberMap(ticket, solution) {
    const sourceAnswers = localizedRecord(solution?.sourceAnswers, "ru");
    const translatedAnswers = localizedRecord(solution?.answers, "ru");
    const answerNumbers = Object.keys(translatedAnswers);
    if (answerNumbers.length === 0 || Object.keys(sourceAnswers).length !== answerNumbers.length) return null;

    const identities = new Map();
    for (const number of answerNumbers) {
      if (!Object.prototype.hasOwnProperty.call(sourceAnswers, number)) return null;

      for (const text of [sourceAnswers[number], translatedAnswers[number]]) {
        const identity = normalizeAnswerIdentity(text);
        if (!identity) return null;

        const existingNumber = identities.get(identity);
        if (existingNumber && existingNumber !== number) return null;
        identities.set(identity, number);
      }
    }

    const displayedAnswers = [...ticket.querySelectorAll(":scope > .t-cover > .t-answer:not(.ans-empty)")];
    if (displayedAnswers.length !== answerNumbers.length) return null;

    const numberMap = {};
    const matchedRealNumbers = new Set();
    for (const displayedAnswer of displayedAnswers) {
      const displayedNumber = getAnswerNumber(displayedAnswer);
      const visibleText = displayedAnswer.querySelector(".t-a-text .text-wrap, .t-a-text")?.textContent || "";
      const realNumber = identities.get(normalizeAnswerIdentity(visibleText));
      if (
        !displayedNumber ||
        !realNumber ||
        Object.prototype.hasOwnProperty.call(numberMap, displayedNumber) ||
        matchedRealNumbers.has(realNumber)
      ) return null;

      numberMap[displayedNumber] = realNumber;
      matchedRealNumbers.add(realNumber);
    }

    const displayedCorrectAnswers = ticket.querySelectorAll(':scope > .t-cover > .t-answer[data-is-correct-list="true"]');
    if (displayedCorrectAnswers.length !== 1) return null;

    const displayedCorrectNumber = getAnswerNumber(displayedCorrectAnswers[0]);
    if (!displayedCorrectNumber || numberMap[displayedCorrectNumber] !== String(solution?.answerNumber || "")) return null;

    return numberMap;
  }

  function getDisplayedCorrectAnswerNumber(ticket, solution) {
    if (isExamPage()) {
      const displayedCorrectAnswers = ticket?.querySelectorAll(':scope > .t-cover > .t-answer[data-is-correct-list="true"]');
      if (displayedCorrectAnswers?.length === 1) {
        const displayedCorrectAnswer = displayedCorrectAnswers[0];
        const visibleNumber = displayedCorrectAnswer.querySelector(".t-a-num")?.textContent.trim() || "";
        if (/^\d+$/.test(visibleNumber)) return visibleNumber;

        const numberClass = [...displayedCorrectAnswer.classList].find((className) => /^t-answer-\d+$/.test(className));
        if (numberClass) return numberClass.slice("t-answer-".length);
      }
    }

    return String(solution?.answerNumber || "");
  }

  function replaceTicketTextWithRussian(ticket, solution) {
    const questionText = localizedText(solution?.question, "ru");
    const answerTexts = localizedRecord(solution?.answers, "ru");
    if (!questionText || Object.keys(answerTexts).length === 0) return;

    const translatedNodes = [];
    const question = ticket.querySelector(".t-question .text-wrap") || ticket.querySelector(".t-question-inner");
    if (question) {
      question.textContent = questionText;
      translatedNodes.push(question);
    }

    const answerNumberMap = isExamPage()
      ? getExamAnswerNumberMap(ticket, solution)
      : Object.fromEntries(Object.keys(answerTexts).map((number) => [number, number]));
    const answerReplacements = answerNumberMap
      ? Object.entries(answerNumberMap).map(([displayedNumber, realNumber]) => {
        const answer = ticket.querySelector(`.t-answer-${displayedNumber} .t-a-text .text-wrap`) || ticket.querySelector(`.t-answer-${displayedNumber} .t-a-text`);
        const answerText = answerTexts[realNumber];
        return answer && answerText ? [answer, answerText] : null;
      })
      : [];
    const answersReady = Boolean(answerNumberMap) && answerReplacements.every(Boolean);
    if (answersReady) {
      answerReplacements.forEach(([answer, answerText]) => {
        answer.textContent = answerText;
        translatedNodes.push(answer);
      });
    }

    ticket.dataset.teoriaRussianText = answersReady ? "true" : "question-only";
    requestAnimationFrame(() => translatedNodes.forEach(fitTranslatedText));
  }

  function fitTranslatedText(node) {
    const container = node.closest(".t-question-inner, .t-answer-inner");
    if (!container || !container.clientHeight) return;

    let size = parseFloat(getComputedStyle(node).fontSize) || 14;
    while (size > 9 && (container.scrollHeight > container.clientHeight + 1 || container.scrollWidth > container.clientWidth + 1)) {
      size -= 0.5;
      node.style.fontSize = `${size}px`;
    }
  }

  function createModal() {
    const existing = document.getElementById(MODAL_ID);
    if (existing) return existing;

    const layer = document.createElement("div");
    layer.id = MODAL_ID;
    layer.className = "teoria-helper-modal-layer";
    layer.hidden = true;
    layer.innerHTML = `
      <section class="teoria-helper-modal" role="dialog" aria-modal="true" aria-labelledby="teoria-helper-modal-title">
        <header class="teoria-helper-modal__header">
          <div>
            <h2 id="teoria-helper-modal-title" class="teoria-helper-modal__title"></h2>
          </div>
          <button class="teoria-helper-modal__close" type="button">×</button>
        </header>
        <section class="teoria-helper-modal__important-note" role="note" aria-labelledby="teoria-helper-modal-important-note-label" hidden>
          <span id="teoria-helper-modal-important-note-label" class="teoria-helper-modal__label teoria-helper-modal__important-note-label"></span>
          <p id="teoria-helper-modal-important-note-text" class="teoria-helper-modal__important-note-text"></p>
        </section>
        <div class="teoria-helper-modal__available">
          <div class="teoria-helper-modal__answer-block">
            <span class="teoria-helper-modal__label teoria-helper-modal__answer-label"></span>
            <strong class="teoria-helper-modal__answer"></strong>
          </div>
          <section class="teoria-helper-modal__explanation-block teoria-helper-modal__explanation-block--ru" lang="ru">
            <span class="teoria-helper-modal__language">RU</span>
            <div>
              <span class="teoria-helper-modal__label teoria-helper-modal__explanation-label--ru"></span>
              <p id="teoria-helper-modal-description-ru" class="teoria-helper-modal__explanation teoria-helper-modal__explanation--ru"></p>
              <div id="teoria-helper-modal-cheat-sheets-ru" class="teoria-helper-modal__cheat-sheets teoria-helper-modal__cheat-sheets--ru" hidden></div>
            </div>
          </section>
          <section class="teoria-helper-modal__explanation-block teoria-helper-modal__explanation-block--en" lang="en">
            <span class="teoria-helper-modal__language">EN</span>
            <div>
              <span class="teoria-helper-modal__label teoria-helper-modal__explanation-label--en"></span>
              <p id="teoria-helper-modal-description-en" class="teoria-helper-modal__explanation teoria-helper-modal__explanation--en"></p>
              <div id="teoria-helper-modal-cheat-sheets-en" class="teoria-helper-modal__cheat-sheets teoria-helper-modal__cheat-sheets--en" hidden></div>
            </div>
          </section>
        </div>
        <div class="teoria-helper-modal__unavailable" hidden>
          <p id="teoria-helper-modal-unavailable-message"></p>
        </div>
      </section>
    `;

    layer.addEventListener("click", (event) => {
      if (event.target === layer || event.target.closest(".teoria-helper-modal__close")) {
        closeModal();
      }
    });

    document.body.append(layer);
    return layer;
  }

  function configureModalLanguage(layer, siteLanguage) {
    const isRussian = siteLanguage === "ru";
    const dialog = layer.querySelector(".teoria-helper-modal");
    const russianBlock = layer.querySelector(".teoria-helper-modal__explanation-block--ru");
    const englishBlock = layer.querySelector(".teoria-helper-modal__explanation-block--en");
    const importantNoteLabel = layer.querySelector(".teoria-helper-modal__important-note-label");
    const unavailableMessage = layer.querySelector("#teoria-helper-modal-unavailable-message");

    dialog.lang = isRussian ? "ru" : "en";
    layer.querySelector(".teoria-helper-modal__close").setAttribute("aria-label", isRussian ? "Закрыть" : "Close");
    layer.querySelector(".teoria-helper-modal__answer-label").textContent = isRussian ? "Правильный ответ" : "Correct answer";
    importantNoteLabel.textContent = isRussian ? "ВАЖНОЕ ЗАМЕЧАНИЕ" : "IMPORTANT NOTE";
    importantNoteLabel.lang = isRussian ? "ru" : "en";
    layer.querySelector(".teoria-helper-modal__explanation-label--ru").textContent = "Объяснение";
    const englishExplanationLabel = layer.querySelector(".teoria-helper-modal__explanation-label--en");
    englishExplanationLabel.textContent = "Explanation";
    englishExplanationLabel.lang = "en";
    russianBlock.hidden = !isRussian;
    englishBlock.hidden = false;
    unavailableMessage.lang = isRussian ? "ru" : "en";
    unavailableMessage.textContent = isRussian
      ? "Ответ для этого вопроса недоступен."
      : "The answer is not available for this question.";

    return isRussian;
  }

  function openModal(ticket, ticketId, mode = "answer") {
    const solution = TICKETS[ticketId];
    const layer = createModal();
    const dialog = layer.querySelector(".teoria-helper-modal");
    const siteLanguage = getSiteLanguage(ticket);
    const isRussian = configureModalLanguage(layer, siteLanguage);
    const isCorrectionOnly = mode === "correction";
    const importantNoteBlock = layer.querySelector(".teoria-helper-modal__important-note");
    const importantNoteText = layer.querySelector(".teoria-helper-modal__important-note-text");
    const available = layer.querySelector(".teoria-helper-modal__available");
    const unavailable = layer.querySelector(".teoria-helper-modal__unavailable");
    const answer = layer.querySelector(".teoria-helper-modal__answer");
    const russianExplanation = layer.querySelector(".teoria-helper-modal__explanation--ru");
    const englishExplanation = layer.querySelector(".teoria-helper-modal__explanation--en");
    const russianCheatSheets = layer.querySelector(".teoria-helper-modal__cheat-sheets--ru");
    const englishCheatSheets = layer.querySelector(".teoria-helper-modal__cheat-sheets--en");
    const importantNote = localizedText(solution?.importantNote, siteLanguage);
    const displayedAnswerNumber = getDisplayedCorrectAnswerNumber(ticket, solution);

    layer.querySelector(".teoria-helper-modal__title").textContent = ticketId
      ? `${isRussian ? "Билет" : "Ticket"} #${ticketId}`
      : isRussian ? "Билет" : "Ticket";

    importantNoteBlock.hidden = true;
    importantNoteText.textContent = "";
    importantNoteText.lang = siteLanguage === "en" ? "en" : "ru";
    available.hidden = true;
    unavailable.hidden = true;
    answer.textContent = "";
    russianExplanation.textContent = "";
    englishExplanation.textContent = "";
    renderCheatSheets(russianCheatSheets, [], "ru");
    renderCheatSheets(englishCheatSheets, [], "en");

    if (isCorrectionOnly && importantNote) {
      importantNoteBlock.hidden = false;
      importantNoteText.textContent = importantNote;
      dialog.setAttribute("aria-describedby", "teoria-helper-modal-important-note-text");
    } else if (solution && !isCorrectionOnly) {
      if (importantNote) {
        importantNoteBlock.hidden = false;
        importantNoteText.textContent = importantNote;
      }
      available.hidden = false;
      answer.textContent = isRussian
        ? `${displayedAnswerNumber} — ${localizedText(solution.answer, "ru")}`
        : displayedAnswerNumber;
      russianExplanation.textContent = isRussian ? localizedText(solution.explanation, "ru") : "";
      englishExplanation.textContent = localizedText(solution.explanation, "en");
      renderCheatSheets(russianCheatSheets, isRussian ? solution.cheatSheets : [], "ru");
      renderCheatSheets(englishCheatSheets, solution.cheatSheets, "en");
      dialog.setAttribute(
        "aria-describedby",
        [
          importantNote ? "teoria-helper-modal-important-note-text" : "",
          isRussian ? "teoria-helper-modal-description-ru" : "",
          isRussian && !russianCheatSheets.hidden ? "teoria-helper-modal-cheat-sheets-ru" : "",
          "teoria-helper-modal-description-en",
          !englishCheatSheets.hidden ? "teoria-helper-modal-cheat-sheets-en" : ""
        ].filter(Boolean).join(" ")
      );
    } else {
      unavailable.hidden = false;
      dialog.setAttribute("aria-describedby", "teoria-helper-modal-unavailable-message");
    }

    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    layer.hidden = false;
    document.documentElement.classList.add("teoria-helper-modal-open");
    layer.querySelector(".teoria-helper-modal__close").focus({ preventScroll: true });
  }

  function closeModal() {
    const layer = document.getElementById(MODAL_ID);
    if (!layer || layer.hidden) return;

    layer.hidden = true;
    document.documentElement.classList.remove("teoria-helper-modal-open");

    if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  }

  function openFromTrigger(trigger, event) {
    if (trigger.classList.contains("teoria-helper-question-trigger")) {
      const interactiveChild = event.target.closest("a, button, input, select, textarea");
      if (interactiveChild) return false;
    }

    const ticket = trigger.closest(".ticket-container");
    if (!ticket) return false;

    const ticketId = getTicketId(ticket);
    const isCorrectionTrigger = trigger.classList.contains("teoria-helper-error-button");
    if (
      isCorrectionTrigger &&
      !localizedText(TICKETS[ticketId]?.importantNote, getSiteLanguage(ticket))
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      trigger.remove();
      return true;
    }

    event.preventDefault();
    event.stopImmediatePropagation();
    openModal(ticket, ticketId, isCorrectionTrigger ? "correction" : "answer");
    return true;
  }

  function makeTrigger(element, label, isQuestion = false) {
    if (!element) return;
    element.classList.add("teoria-helper-trigger");
    if (isQuestion) element.classList.add("teoria-helper-question-trigger");
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-haspopup", "dialog");
    element.setAttribute("aria-controls", MODAL_ID);
    element.setAttribute("aria-label", label);
    element.setAttribute("title", label);
  }

  function restoreNativeHelpButton(ticket) {
    const nativeButton = ticket.querySelector(".desc-button");
    if (!nativeButton?.classList.contains("teoria-helper-trigger")) return;

    nativeButton.classList.remove("teoria-helper-trigger", "teoria-helper-question-trigger");
    nativeButton.removeAttribute("role");
    nativeButton.removeAttribute("tabindex");
    nativeButton.removeAttribute("aria-haspopup");
    nativeButton.removeAttribute("aria-controls");
    nativeButton.removeAttribute("aria-label");
    nativeButton.removeAttribute("title");
  }

  function ensureActions(ticket) {
    let actions = ticket.querySelector(":scope > .teoria-helper-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "teoria-helper-actions";
      ticket.append(actions);
    }
    return actions;
  }

  function ensureAnswerButton(ticket, solution, siteLanguage) {
    const actions = ensureActions(ticket);
    let button = actions.querySelector(":scope > .teoria-helper-answer-button");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "teoria-helper-answer-button";
      actions.append(button);
    }

    const buttonText = siteLanguage === "ru" ? "ОТВЕТ" : "ANSWER";
    const label = solution
      ? siteLanguage === "ru"
        ? "Показать правильный ответ и объяснения на русском и английском"
        : "Show the correct answer and explanation in English"
      : siteLanguage === "ru"
        ? "Ответ для этого вопроса недоступен"
        : "The answer is not available for this question";

    button.textContent = buttonText;
    makeTrigger(button, label);
    return buttonText;
  }

  function ensureErrorButton(ticket, solution, siteLanguage) {
    const actions = ensureActions(ticket);
    let button = actions.querySelector(":scope > .teoria-helper-error-button");
    const shouldShow = Boolean(localizedText(solution?.importantNote, siteLanguage));

    if (!shouldShow) {
      button?.remove();
      return;
    }

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "teoria-helper-error-button";
      actions.prepend(button);
    }

    const isRussian = siteLanguage === "ru";
    button.textContent = isRussian ? "ОШИБКА В ОПИСАНИИ" : "ERROR IN THE TICKET";
    makeTrigger(button, isRussian ? "Показать описание ошибки в билете" : "Show the error in the ticket");
  }

  function prepareTickets() {
    const ticketContainers = getTicketContainers();
    if (ticketContainers.length === 0) return;

    createModal();
    ticketContainers.forEach((ticket) => {
      const ticketId = getTicketId(ticket);
      const ticketKey = ticketId || "";
      const siteLanguage = getSiteLanguage(ticket);
      if (
        ticket.dataset.teoriaHelperReady === "true" &&
        ticket.dataset.teoriaHelperTicketId === ticketKey &&
        ticket.dataset.teoriaHelperLanguage === siteLanguage
      ) return;

      const solution = ticketId ? TICKETS[ticketId] : null;
      if (
        siteLanguage === "ru" &&
        solution?.replaceOnRussianSite
      ) {
        replaceTicketTextWithRussian(ticket, solution);
      }

      ticket.dataset.teoriaHelperReady = "true";
      ticket.dataset.teoriaHelperTicketId = ticketKey;
      ticket.dataset.teoriaHelperLanguage = siteLanguage;
      ticket.classList.add("teoria-helper-ticket");
      ticket.classList.toggle("teoria-helper-supported", Boolean(solution));
      ticket.classList.toggle("teoria-helper-unsupported", !solution);

      const questionLabel = solution
        ? siteLanguage === "ru"
          ? "Показать правильный ответ и объяснения на русском и английском"
          : "Show the correct answer and explanation in English"
        : siteLanguage === "ru"
          ? "Ответ для этого вопроса недоступен"
          : "The answer is not available for this question";
      makeTrigger(ticket.querySelector(".t-question"), questionLabel, true);
      restoreNativeHelpButton(ticket);
      ticket.dataset.teoriaHelperStatus = ensureAnswerButton(ticket, solution, siteLanguage);
      ensureErrorButton(ticket, solution, siteLanguage);
    });
  }

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest(".teoria-helper-trigger");
    if (trigger) openFromTrigger(trigger, event);
  }, true);

  document.addEventListener("keydown", (event) => {
    const layer = document.getElementById(MODAL_ID);

    if (isExamPage() && layer && !layer.hidden && EXAM_SHORTCUT_KEYS.has(event.key)) {
      suppressedExamKeyups.add(event.code || event.key);
      event.preventDefault();
      event.stopImmediatePropagation();
      const closeButton = event.target instanceof Element && event.target.closest(".teoria-helper-modal__close");
      if (event.key === "Escape" || (closeButton && ["Enter", " "].includes(event.key))) closeModal();
      return;
    }

    if (event.key === "Escape" && layer && !layer.hidden) {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab" && layer && !layer.hidden) {
      event.preventDefault();
      layer.querySelector(".teoria-helper-modal__close").focus({ preventScroll: true });
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && event.target instanceof Element) {
      const trigger = event.target.closest(".teoria-helper-trigger");
      if (trigger && openFromTrigger(trigger, event) && isExamPage()) {
        suppressedExamKeyups.add(event.code || event.key);
      }
    }
  }, true);

  document.addEventListener("keyup", (event) => {
    if (!isExamPage()) return;

    const key = event.code || event.key;
    const layer = document.getElementById(MODAL_ID);
    const modalBlocksShortcut = layer && !layer.hidden && EXAM_SHORTCUT_KEYS.has(event.key);
    if (!suppressedExamKeyups.has(key) && !modalBlocksShortcut) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    suppressedExamKeyups.delete(key);
  }, true);

  window.addEventListener("blur", () => suppressedExamKeyups.clear());

  prepareTickets();
  new MutationObserver(prepareTickets).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
    childList: true,
    subtree: true,
    characterData: true
  });
})();
