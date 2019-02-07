function Start-Page {
  [CmdletBinding()]
  param(
    [string] $rootPath,
    [string] $file,
    [object] $line,
    [bool]   $cleanup,
    [string] $Arg1
  ) 

  [string]$pageName = $line.Arg1
  [string]$templateName = $line.Arg2
  [string]$pageTitle = $line.Arg3
  [string]$folderPath = $line.Arg4

  if ($cleanup -eq $true) {
    Write-Info "Cleanup not implemented ..."
    return
  }
  
  Write-Info "Creating new page: $pageName"
  if ([string]::IsNullOrEmpty($folderPath)) {
    Add-PnPPublishingPage -PageName $pageName -PageTemplateName $templateName -Title $pageTitle 
  }
  else {
    Add-PnPPublishingPage -PageName $pageName -PageTemplateName $templateName -Title $pageTitle -FolderPath $folderPath
  }

  $currWeb = Get-PnPWeb -Includes @('ServerRelativeUrl')
  $serverRelUrl = $currWeb.ServerRelativeUrl
  $pageUrl = "$serverRelUrl/Pages/$pageName" + ".aspx"

  $webparts = Import-Csv "$rootPath/csv/Webparts.csv" | Where-Object { $_.Page -eq $pageName }

  Set-PnPFileCheckedOut -Url $pageUrl ##"/sites/EGDev/Pages/TestPae2.aspx"
  foreach($wp in $webparts) {
    $wpNameAndPath = "$rootPath\webparts\$($wp.Name)"
    $wpZoneId = $wp.ZoneId
    $wpZoneIndex = $wp.ZoneIndex

    if (Test-Path $wpNameAndPath) {
      Write-Info "  adding webpart: $($wp.Name)"
      Add-PnPWebPartToWebPartPage -ServerRelativePageUrl $pageUrl -Path $wpNameAndPath -ZoneId $wpZoneId -ZoneIndex $wpZoneIndex
    }
    else {
      Write-Error "Webpart file: $wpNameAndPath not found."
    }
  }
  Set-PnPFileCheckedIn -Url $pageUrl ##"/sites/EGDev/Pages/TestPae2.aspx"
}