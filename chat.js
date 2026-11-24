(() => {
  const site = playbackSites[location.hostname];
  const { user: userSelector, reply: replySelector, composer: composerSelector,
    send: sendSelector, read: readSelector, stop: stopSelector } = site;

  let enabled = false;
  let pending;
  let timer;
  let observedPath = location.pathname;
  let observedUser;
  const latest = selector => [...document.querySelectorAll(selector)].at(-1);
  function key(element) {
    const row = site.row && element?.closest(site.row);
    return element?.getAttribute('data-message-id') || element?.getAttribute('data-chatgpt-search-unit-key') ||
      element?.getAttribute('data-response-body') || row?.getAttribute('data-turn-key') || row?.id || element;
  }

  function finishedTurn(reply) {
    if (reply.getAttribute('data-response-body')) {
      return reply.closest('[data-talvt-turn-state="complete"]');
    }
    if (document.querySelector(stopSelector)) return null;
    return site.turn ? reply.closest(site.turn) : reply;
  }

  const available = button => button?.isConnected && !button.disabled &&
    button.getAttribute('aria-disabled') !== 'true';

  function play(button, reply) {
    if (!site.menuLabel) {
      if (button.getAttribute('aria-pressed') !== 'true') button.click();
      return;
    }

    const menuSelector = '[role="menu"]';
    if ([...document.querySelectorAll(menuSelector)].some(menu => menu.getClientRects().length) ||
        document.querySelector('button[aria-label="Pause"]')) return;
    const path = location.pathname;
    const expires = Date.now() + 1200;
    button.click();
    function listen() {
      if (!enabled || document.visibilityState !== 'visible' || location.pathname !== path ||
          !reply.isConnected || latest(replySelector) !== reply || Date.now() >= expires) return;
      const options = [...document.querySelectorAll('[role="menu"] [role="menuitem"]')].filter(item =>
        available(item) && item.getClientRects().length &&
        (item.getAttribute('aria-label') || item.textContent.trim()) === site.menuLabel);
      if (options.length === 1) options[0].click();
      else if (options.length === 0) setTimeout(listen, 50);
    }
    listen();
  }

  function clearPending() {
    clearTimeout(timer);
    timer = undefined;
    pending = undefined;
  }

  function schedule(delay = 200) {
    if (!pending || timer) return;
    timer = setTimeout(() => {
      timer = undefined;
      checkReply();
    }, delay);
  }

  function arm(previousUser = key(latest(userSelector))) {
    if (!enabled || document.visibilityState !== 'visible') return;
    if (pending?.route === location.pathname && pending.previousUser === previousUser) return;
    clearPending();
    pending = {
      route: location.pathname,
      previousUser,
      previousReply: key(latest(replySelector)),
      sentAt: Date.now(),
    };
    schedule();
  }

  function checkReply() {
    if (!pending) return;
    const path = location.pathname;
    if (path !== pending.route) {
      if (!site.thread.test(pending.route) && site.thread.test(path)) {
        pending.route = path;
      } else {
        clearPending();
        return;
      }
    }

    const user = latest(userSelector);
    if (!user || key(user) === pending.previousUser) {
      if (Date.now() - pending.sentAt < 10000) schedule();
      else clearPending();
      return;
    }

    const reply = latest(replySelector);
    if (!reply || key(reply) === pending.previousReply ||
        !(user.compareDocumentPosition(reply) & Node.DOCUMENT_POSITION_FOLLOWING)) return;

    const button = finishedTurn(reply)?.querySelector(readSelector);
    if (!available(button)) {
      pending.readyButton = undefined;
      return;
    }

    if (pending.readyButton !== button) {
      pending.readyButton = button;
      pending.readyAt = Date.now() + 350;
    }
    if (Date.now() < pending.readyAt) {
      schedule(pending.readyAt - Date.now());
      return;
    }

    clearPending();
    observedUser = key(user);
    if (enabled && document.visibilityState === 'visible' && button.isConnected &&
        available(button)) {
      play(button, reply);
    }
  }

  document.addEventListener("click", event => {
    const send = event.target.closest?.(sendSelector);
    if (send && !send.disabled && !send.matches(stopSelector)) arm();
  }, true);

  document.addEventListener('submit', event => {
    const composer = event.target.querySelector?.(composerSelector);
    if (composerText(composer)) arm();
  }, true);

  document.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey && !event.altKey && !event.ctrlKey &&
        !event.metaKey && !event.isComposing && !event.repeat &&
        composerText(event.target.closest?.(composerSelector))) arm();
  }, true);

  function composerText(composer) {
    return (composer?.value ?? composer?.textContent ?? '').trim();
  }

  function observeTurn() {
    const user = latest(userSelector);
    const userKey = key(user);
    if (location.pathname !== observedPath) {
      observedPath = location.pathname;
      observedUser = userKey;
    } else if (!pending && userKey !== observedUser) {
      const changedWorkTurn = observedUser && document.visibilityState === 'visible' &&
        user?.closest?.('[data-talvt-turn-state]')?.getAttribute('data-talvt-turn-state') === 'in_progress';
      if (changedWorkTurn) arm(observedUser);
      observedUser = userKey;
    }
    schedule();
  }

  observedUser = key(latest(userSelector));
  let settingsChanged = false;
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.autoRead) return;
    settingsChanged = true;
    enabled = changes.autoRead.newValue === true;
    if (!enabled) clearPending();
  });
  chrome.storage.local.get({ autoRead: false }).then(({ autoRead }) => {
    if (!settingsChanged) enabled = autoRead === true;
  }).catch(() => {});

  new MutationObserver(observeTurn).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['aria-label', 'aria-disabled', 'aria-pressed', 'disabled', 'data-testid', 'data-is-streaming', 'data-talvt-turn-state', 'data-local-conversation-final-assistant'],
  });
})();

