function Start-ContentType {
  [CmdletBinding()]
  param(
    [string] $DeployFolder,
    [string] $File,
    [object] $Step,
    [bool]   $Cleanup,
    [string] $Arg1
  ) 

  $ctDefinitionsFullPath = Join-Path -Path $DeployFolder -ChildPath $Arg1
  Write-Info "Using CSV File from $ctDefinitionsFullPath"

  $ctDefinitions = Import-Csv $ctDefinitionsFullPath
  
  foreach ($ctDefinition in $ctDefinitions){
    [string]$ctName = $ctDefinition.ContentType
    [string]$ctDesc = $ctDefinition.Description
    [string]$ctID = $ctDefinition.ID
    [string]$ctGroup = $ctDefinition.Group

    Write-Host "Adding fields to content type: $ctName"
    $ct = Get-PnPContentType -Identity $ctID -ErrorAction SilentlyContinue

    if ($ct -ne $null) {
      $ctFieldsFullPath = Join-Path -Path $DeployFolder -ChildPath $File
      $ctFields = Import-Csv $ctFieldsFullPath | Where-Object { $_.ContentType -eq $ctName }
    
      foreach ($field in $ctFields) {
        [string]$fldName = $field.FieldInternalName
        [boolean]$required = @{$true=$true;$false=$false}[$field.Required -eq "Yes"]
        [boolean]$hidden = @{$true=$true;$false=$false}[$field.Hidden -eq "Yes"]

        Write-Info " Adding field: $fldName ..."
        Add-PnPFieldToContentType -Field $fldName -ContentType $ct -Required:$required -Hidden:$hidden
      }
    }
  }

}