## view-port

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

* gulp clean - delete built libs and sppkg files
* gulp serve - launch the local web server for debugging
* gulp build - compile the solution
* gulp bundle - bundle web parts and other components into JavaScript
* gulp package-solution - collect bundles and create deployable sppkg app file
* npm run build - run gulp build, bundle, and package-solution with --SHIP to create the deployable standalone app

### Provisioning

Site columns, lookup lists, content types, lists and libraries, and incidental files are provisioned using the PowerShell scripts in 
/provisioning. Individual environments are configured in the provisioning/environments folder. Create a folder for the environment and copy 
the config and csv files that define the elements.

#### Executing Provisioning

Open a PowerShell window and navigate to the provisioning folder then run one of the following:

1. To let the script receive login credentials each time it runs
```
.\main.ps1 -RootFolder \<relative path to folder containing csv files> 
```
2. To store credentials for the session
```
$cred = Get-Credentials
\main.ps1 -RootFolder \<relative path to folder containing csv files> -credentials $cred -noDisconnect
```
3. To store credentials permanently
Add your login credentials in Windows Credential Manager as a Windows -> Generic credential
```
.\main.ps1 -RootFolder \<relative path to folder containing csv files> -useCredentialManager
```
### Search Configuration

The Data Marketplace is composed of two web parts, the search box (in src/webparts/searchBox), and the search results (in 
src/webparts/searchResults), and a custom result renderer (in src/extensions/dataMarketplaceRenderer). To create the Data Marketplace page, 
add the search box web part and results web part to a Site Page. The search box doesn't require any configuration. Most of the results web 
part is preconfigured, but in addition, it's necessary to set up the sorting and refining fields, and to select the custom Data Marketplace 
renderer on page 3 of the web part configuration.