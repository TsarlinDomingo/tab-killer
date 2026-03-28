# Tab Killer Extension

**Tab Killer** is a Chrome extension that helps manage the number of open tabs by automatically closing inactive tabs after a set period. The extension allows users to whitelist specific websites, preventing them from being closed automatically.

## Features

- **Auto-close inactive tabs**: Tabs that remain inactive for a user-defined period are automatically closed to free up browser resources.
- **Whitelisting**: Users can add specific URLs or domains to a whitelist, preventing those tabs from being closed even after being inactive.
- **Customizable inactivity timeout**: Users can set the time period for how long tabs should be inactive before they are closed.
- **Manifest V3 Compliant**: Uses modern Chrome APIs (`chrome.alarms` and `chrome.storage.local`) ensuring it runs efficiently without wasting background memory.

## Installation

To install and run the extension locally, follow these steps:

1. Clone this repository:
   ```bash
   git clone https://github.com/TsarlinDomingo/tab-killer.git
   cd tab-killer
   ```

2. Open Google Chrome and navigate to the Extensions page:
   - Enter `chrome://extensions/` in the address bar.

3. Enable **Developer mode** by toggling the switch in the top-right corner.

4. Click the **Load unpacked** button in the top-left corner.

5. Select the `tab-killer` directory where you cloned this repository.

6. The extension will now appear in your list of extensions, and its icon will be added to the Chrome toolbar.

## How to Test and Debug

Because the extension runs in the background using a Service Worker and Alarms, here's how you can verify it's working properly:

### 1. Testing the Popup & Settings
- Click the **Tab Killer** extension icon in your toolbar.
- **Set Timeout**: Adjust the timeout period (e.g., set it to `1` minute for quick testing) and click "Save".
- **Whitelist URLs**: Enter a URL (e.g., `youtube.com`) and click "Add URL". Verify it appears in the list below.

### 2. Testing the Auto-Close Feature
- Open a few new tabs (some whitelisted, some not).
- Leave the tabs alone (do not click on them) for the duration of the timeout you set.
- Wait for the background alarm to trigger (it checks every 1 minute).
- Non-whitelisted tabs that have exceeded the timeout limit should automatically close.

### 3. Debugging the Service Worker
To see the background logs and verify the alarm is firing:
1. Go to `chrome://extensions/`.
2. Find the **Tab Killer** extension card.
3. Click the **service worker** link next to "Inspect views". This will open Chrome DevTools specifically for the background script.
4. Go to the **Console** tab.
5. You should see logs like `Checking inactive tabs via Alarm` printing every minute. You will also see `Closing inactive tab: ...` when a tab is forcefully closed.

## Files in the Repository

- `manifest.json`: Defines the extension's permissions, background service worker, and metadata.
- `background.js`: Contains the background logic (alarms, storage tracking, and auto-closing logic).
- `popup.html`: The UI that allows users to manage the whitelist and set timeout values.
- `popup.js`: Handles the logic for interacting with the popup UI and saving settings to Chrome sync storage.

## Contributing
If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request with your changes. Contributions are always welcome!

## Roadmap
- **Custom Notifications**: Notify users before automatically closing a tab.
- **Domain-based Whitelisting**: Enhance the whitelisting feature to allow entire domains to be whitelisted instead of just specific URLs.
- **Pause Feature**: Allow users to temporarily pause the automatic closing of tabs.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.