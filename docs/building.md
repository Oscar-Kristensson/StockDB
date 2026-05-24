# Building

This guide covers setting up a development environment and producing distributable builds for StockDB.


## Prerequisites
Tauri requires specific system dependencies depending on your OS. Please follow [the official Tauri guide](https://v2.tauri.app/start/prerequisites/) for your platform. 

## Development Setup

**Clone the repo**

Once you have all the dependencies, clone the repository.
```bash
git clone https://github.com/Oscar-Kristensson/StockDB.git
cd StockDB
```


**Run in development mode**
```bash
npm run tauri dev
```
This starts the frontend dev server and the Tauri window with hot reload.

If you get the following error when running the command, you most likely do not have tauri installed.

```
'tauri' is not recognized as an internal or external command,
operable program or batch file.
```

Install by running the command bellow, if it does not work, make sure you followed the instructions provided in the link above.

```
npm install -D @tauri-apps/cli@latest
```

<!-- When test are added (if ever)
## Running Tests

**Frontend**
```bash
npm test
```

**Rust (backend)**
```bash
cargo test
```
-->


## Building & Packaging

To produce a release build for your current platform:

```bash
npm run tauri build
```

Output is placed in `src-tauri/target/release/bundle/`:

| Platform | Output format         | Location                          |
|----------|-----------------------|-----------------------------------|
| macOS    | `.dmg`, `.app`        | `bundle/dmg/`, `bundle/macos/`    |
| Linux    | `.deb`, `.AppImage`   | `bundle/deb/`, `bundle/appimage/` |
| Windows  | `.msi`, `.exe`        | `bundle/msi/`, `bundle/nsis/`     |

> **Note:** Tauri builds are platform-specific — you must build on the target OS.
> Cross-compilation is not supported out of the box. Use CI (e.g. GitHub Actions) to build for multiple platforms.

## Troubleshooting

**`cargo tauri dev` fails immediately**
- Make sure all platform dependencies above are installed
- Try `cargo clean` and re-run

**WebView not found (Linux)**
- Install `libwebkit2gtk-4.1-dev` and retry

**Node modules out of date**
- Run `npm install` again after pulling changes

---

## Useful Links

- [Tauri documentation](https://v2.tauri.app/start/)
- [Tauri GitHub](https://github.com/tauri-apps/tauri)