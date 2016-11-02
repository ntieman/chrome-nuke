# Chrome Nuke

Remove annoying elements with explosions.

Click the bomb to arm, then click on an element to nuke it.

## API

`chrome.runtime.sendMessage(extensionID, { action: 'arm' })`

## Build

`npm run build`

Performs all build tasks.

`npm run build icons`

Creates resized icons.

`npm run build zip`

Creates ZIP file in [/dist](/dist).

## Testing

`npm test`

Currently fails because extension has no ID.

`npm run server`

Starts a local server with a simple test page accessible at <http://localhost:3000>.
