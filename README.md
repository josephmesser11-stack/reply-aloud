# Reply Aloud

**Hear your AI's replies without reaching for the mouse.**
Reply Aloud is a free desktop Microsoft Edge extension that waits for ChatGPT, Claude, or Gemini to finish a reply, then starts that site's own built-in voice for you.

> **Beta 0.1.1.** Tested live in desktop Microsoft Edge on chatgpt.com, claude.ai, and gemini.google.com (English interface).

---

## What it does

You chat the way you normally do. When a new reply finishes, Reply Aloud presses the site's own playback control for you:

| Site | Control Reply Aloud uses |
| --- | --- |
| ChatGPT (chatgpt.com) | The reply's **Read aloud** button |
| Claude (claude.ai) | The reply's **Read aloud** button |
| Gemini (gemini.google.com) | The reply's **More options** menu, then **Listen** |

- **One switch for all three sites.** Turn on **Auto-read finished replies** once in the toolbar popup.
- **New replies only.** It does not read your chat history when you open an old conversation.
- **Visible tab only.** Playback starts in the tab you're looking at, not in background tabs.
- **The site's own voice.** Audio comes from ChatGPT, Claude, or Gemini, not from a separate speech service. Each site's own limits and settings still apply.
- **No live voice mode needed.** You keep typing. Reply Aloud only plays the finished written reply.

To stop or pause a reply in progress, use the site's own playback control.

## Install (Developer mode, about 1 minute)

Reply Aloud is not in the Edge Add-ons store yet. Until it is, install it like this:

1. Download **`reply-aloud-0.1.1-beta.zip`** from the [latest release](../../releases).
2. Right-click the ZIP and choose **Extract All**. Keep the extracted folder somewhere permanent. Edge loads the extension from that folder, so don't delete it.
3. Open Edge and go to `edge://extensions`.
4. Turn on **Developer mode** (bottom left).
5. Click **Load unpacked** and select the extracted folder, the one that contains `manifest.json`.
6. Click the puzzle-piece **Extensions** button in the toolbar, open **Reply Aloud**, and check **Auto-read finished replies**. Pin it if you like.
7. Refresh any ChatGPT, Claude, or Gemini tabs that were already open, then send a short message.

> **Tip:** If you have another auto-read or text-to-speech extension running on these sites, turn it off to avoid two voices at once.

Edge may show a reminder about developer-mode extensions. That is normal for extensions loaded this way.

### Updating

Download the new release ZIP, replace the contents of your extension folder with it, then click **Reload** on Reply Aloud in `edge://extensions`.

## Privacy

Reply Aloud does not collect, copy, store, or send your conversations anywhere.

- It has **one** permission: `storage`, used only to remember whether auto-read is on or off (saved locally in your browser).
- It runs only on `chatgpt.com`, `claude.ai`, and `gemini.google.com`.
- It makes **no network requests** of its own and uses no analytics.
- It does not use your microphone and does not control live voice mode.

See [PRIVACY.md](PRIVACY.md) for details.

## How it works

A small content script (`sites.js` + `chat.js`) runs on the three supported sites. When you send a message, it watches the page for the new reply to finish, waits until that reply's playback control is ready, and clicks it once. The settings popup (`popup.html`) stores a single on/off value in `chrome.storage.local`. Built on Manifest V3. No build step and no dependencies.

## Known limitations

- **Beta.** These sites change their page layout from time to time. If an update moves or renames their Read aloud control, auto-read may stop working until Reply Aloud is updated.
- Verified on **desktop Microsoft Edge** only. Chrome may work (same extension engine) but hasn't been tested yet. Firefox, Safari, mobile browsers, and desktop apps are not supported.
- English site interfaces only.
- Third-party AI aggregator sites are not supported.
- Playback depends on each site's own voice feature being available on your account.

## Feedback

Found a bug or a site change that broke playback? Please [open an issue](../../issues) with your Edge version, the site, and what happened.

## License

[MIT](LICENSE)

---

*Reply Aloud is an independent project. It is not affiliated with or endorsed by OpenAI, Anthropic, Google, or Microsoft. ChatGPT, Claude, Gemini, and Microsoft Edge are trademarks of their respective owners.*
