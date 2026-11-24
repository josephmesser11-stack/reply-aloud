# Reply Aloud privacy policy

*Last updated: November 24, 2026 · Applies to version 0.1.1 beta*

Reply Aloud is built to do one job without handling your data.

## What it stores

One setting: whether **Auto-read finished replies** is on or off. It is saved with `chrome.storage.local`, which keeps it in your own browser profile. It is never sent anywhere.

## What it does not do

- It does not read, copy, save, or transmit the text of your prompts or replies.
- It does not make network requests, use analytics, or load remote code.
- It does not use your microphone or control live voice mode.
- It does not run on any site other than `chatgpt.com`, `claude.ai`, and `gemini.google.com`.

## How playback works

On those three sites, Reply Aloud looks at the page only to find when a new reply has finished and where that reply's playback control is. It then clicks that control once. The voice you hear is produced by the AI site itself, under that site's own privacy policy and terms.

## Permissions

| Permission | Why |
| --- | --- |
| `storage` | Remember the on/off setting |
| Site access: `chatgpt.com`, `claude.ai`, `gemini.google.com` | Detect finished replies and press their playback control |

## Contact

Questions or concerns: open an issue on this repository.
