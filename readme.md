# Tab Manager Extension

**Tab Manager** is a Chrome extension that helps manage the number of open tabs by automatically closing inactive tabs after a set period. The extension allows users to whitelist specific websites, preventing them from being closed automatically.

## Features

- **Auto-close inactive tabs**: Tabs that remain inactive for a user-defined period are automatically closed to free up browser resources.
- **Whitelisting**: Users can add specific URLs or domains to a whitelist, preventing those tabs from being closed even after being inactive.
- **Customizable inactivity timeout**: Users can set the time period for how long tabs should be inactive before they are closed.

## Installation

To install and test the extension locally, follow these steps:

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/tab-manager.git
   cd tab-manager

2. Open Chrome and navigate to the Extensions page:
  - Enter chrome://extensions/ in the address bar or go to "Menu" > "More Tools" > "Extensions".
3. Enable Developer mode by toggling the switch in the top-right corner.
4. Click Load unpacked and select the directory where you cloned this repository.
5. The extension will now appear in your list of extensions, and you can use it by clicking the extension icon in the Chrome toolbar.

## How to Use
1. Set Timeout: The extension automatically closes tabs after a default period of 10 minutes of inactivity. You can adjust this timeout period through the popup UI by specifying a new timeout value (in minutes).
2. Whitelist URLs:
  - To prevent specific tabs from being automatically closed, add their URLs to the whitelist through the extension’s popup.
  - Enter a URL in the input box and click "Add URL" to add it to the whitelist.
  - The list of whitelisted URLs is displayed in the popup, and you can remove them by clicking the "Remove" button next to each URL.
3. Auto-close Tabs: Once the timeout is reached, inactive tabs (except those on the whitelist) will automatically close.

## Files in the Repository
- `manifest.json`: Defines the extension's permissions and metadata.
- `background.js`: Contains the logic for tracking inactive tabs and automatically closing them after a set period.
- `popup.html`: The user interface that allows users to manage the whitelist and set timeout values.
- `popup.js`: Handles the logic for adding/removing URLs to/from the whitelist and saving the settings in Chrome storage.

## How to Use
If you'd like to contribute to this project, feel free to fork the repository, create a new branch, and submit a pull request with your changes. Contributions are always welcome!

## Roadmap
- Custom Notifications: Notify users before automatically closing a tab.
- Domain-based Whitelisting: Enhance the whitelisting feature to allow entire domains to be whitelisted instead of just specific URLs.
- Pause Feature: Allow users to temporarily pause the automatic closing of tabs.

## Roadmap
This project is licensed under the MIT License. See the LICENSE file for more details.