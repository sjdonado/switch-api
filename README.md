# Setup
```
    nvm use 8.11
    curl https://sdk.cloud.google.com | bash
    npm install -g firebase-tools @google-cloud/functions-emulator
    gcloud auth application-default login
```
# Setup server
switch-dev-smartrends@appspot.gserviceaccount.com // App Engine default service account
* Permission iam.serviceAccounts.signBlob in IAM
* Cloud functions service agent

# Setup android
* values/google_maps_api

# Local deploy
```
    npm start
```
# Debug
```
    functions start
    npm run debug
```
# Logs
```
    npm run logs
```