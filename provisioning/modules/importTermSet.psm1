function Start-TermSet {
  [CmdletBinding()]
  param(
    [string] $rootPath,
    [string] $file,
    [object] $line,
    [bool]   $cleanup,
    [string] $Arg1
  ) 

  . "$rootPath\config\config.ps1"
  $termSetGroup = $TermSetGroupName 

  $filePath = "$rootPath\termSets\$file"

  if ($cleanup -eq $true) {
    Write-Error "Clean up not implemented..."
    return
  }
  
  Write-Info "Importing term set to Term Group: $termSetGroup..."
  Import-PnPTermSet -Path $filePath -GroupName $termSetGroup
  Write-Success "Successfully imported term set"
}
