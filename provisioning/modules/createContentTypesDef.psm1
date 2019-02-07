function Start-ContentTypeDef {
  [CmdletBinding()]
  param(
    [string] $DeployFolder,
    [string] $File,
    [object] $Step,
    [bool]   $Cleanup,
    [string] $Arg1
  ) 

  
  $fullPath = Join-Path -Path $DeployFolder -ChildPath $File
  $ctDefinitions = Import-Csv $fullPath
  
  foreach ($ctDefinition in $ctDefinitions){
  
      [string]$ctName = $ctDefinition.ContentType
      [string]$ctDesc = $ctDefinition.Description
      [string]$ctID = $ctDefinition.ID
      [string]$ctGroup = $ctDefinition.Group

      $ct = Get-PnPContentType -Identity $ctID -ErrorAction SilentlyContinue
      if ($Cleanup -eq $true) {
        if ($ct -ne $null) {
          Write-Info "Deleting content type: $ctName ..."
          Remove-PnPContentType -Identity $ctName -Force
        }
        return
      }
  
      if ($ct -ne $null) {
        Write-Warning "Content type: $ctName already exists"
      }
      else {
        Write-Info "Creating content type: $ctName ..."
        $ct = Add-PnPContentType -ContentTypeId $ctID -Name $ctName -Group $ctGroup
      }
  
  }
  
 
}