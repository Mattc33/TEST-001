param(
	[string]$Env,
	[string]$RootFolder,
	[switch]$cleanup,
	[object]$credential,
	[boolean]$noDisconnect,
	[boolean]$useCredentialManager,
    [boolean]$useWebLogin
)

Remove-Module * -ErrorAction SilentlyContinue

#Fix for PowerShell Script Not Digitally Signed - Run Following
#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

Import-Module SharePointPnPPowerShellOnline
Import-Module "$PSScriptRoot\modules\common.psm1" 
Import-Module "$PSScriptRoot\modules\importTermSet.psm1" 
Import-Module "$PSScriptRoot\modules\createSiteColumns.psm1" 
Import-Module "$PSScriptRoot\modules\createContentTypesDef.psm1" 
Import-Module "$PSScriptRoot\modules\createContentTypes.psm1" 
Import-Module "$PSScriptRoot\modules\createLists.psm1" 
Import-Module "$PSScriptRoot\modules\createPages.psm1" 
Import-Module "$PSScriptRoot\modules\UploadFiles.psm1"

function Run()
{
	Write-Title "Deploying from root folder: $RootFolder"

	$deployFolder = Join-Path -Path $PSScriptRoot -ChildPath $RootFolder
  $deployFile = Join-Path $deployFolder "deployment.main.csv"
	Write-Host "Deployment master config: $deployFile"

	$configFile = Join-Path -Path $deployFolder -ChildPath "config.ps1"
	Write-Host "Executing base config from $configFile"	
	. $configFile # note that the initial dot-space is required to execute this properly

	Write-Host "Connecting to site at $SiteUrl"

	if(($null -eq $credential) -and -not $useCredentialManager) {
		$credential = Get-Credential -Message "Enter user name and password for $SiteUrl"
	}

	if($useCredentialManager) {
		Connect-PnPOnline -Url $SiteUrl
	} 
    if ($useWebLogin){
		Connect-PnPOnline -Url $SiteUrl -UseWebLogin
	}
    else
    {
        Connect-PnPOnline -Url $SiteUrl -Credentials $credential
    }
	$web = Get-PnPWeb

	Write-Host "Target Web : $($web.Url)"

	$deploySteps = Import-Csv $deployFile
	foreach($step in $deploySteps)
	{
    [string]$execute  = $step.Execute
		[string]$type     = $step.Type
		[string]$fileName = $step.FileName
    
    if ($execute -ne "Yes")
		{
			Write-Success "Ignoring step. Type: $type, File name: $fileName"
			continue
    }
    
    Write-Title "Processing Type: $type, File name: $fileName" 
		
		[string]$cmd = "Start-$type"
		Write-Host "cmd: $cmd, Deploy Folder: $deployFolder, File Name: $fileName, Step: $step"
		&$cmd -DeployFolder $deployFolder -File $fileName -Step $step -Cleanup $cleanup -Arg1 $step.Arg1
	}
	
	if(-not $noDisconnect) {
		Disconnect-PnPOnline 
	}
}

Run