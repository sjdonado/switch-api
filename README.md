# Setup
```
    nvm install 6.11
    yarn global add firebase-tools
    yarn global add @google-cloud/functions-emulator
    gcloud auth application-default login
```
# Setup server
switch-dev-smartrends@appspot.gserviceaccount.com // App Engine default service account
* client_email -> ~/.config/gcloud/application_default_credentials.json
* Permission iam.serviceAccounts.signBlob in IAM
* Cloud functions service agent

# Local deploy
```
    yarn run local-deploy
```
# Build and deploy
```
    yarn build && yarn deploy
```
# Debug
```
    functions start
    yarn run build && yarn run debug
```
# Logs
```
    functions logs read switchDev
```