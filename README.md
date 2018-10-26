# Setup
```
    yarn global add firebase-tools
    yarn
```
# Build and deploy
```
    yarn build && yarn deploy
```
# Debug
```
    nvm install 6.11
    yarn global add @google-cloud/functions-emulator
    yarn run build && yarn run debug
```