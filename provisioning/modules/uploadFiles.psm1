function Start-Files {
    [CmdletBinding()]
    param(
    [string] $DeployFolder,
    [string] $File,
    [object] $Step,
    [bool]   $Cleanup,
    [string] $Arg1
    )
  
    $fullPath = Join-Path -Path $DeployFolder -ChildPath $File
    Write-Info "Using CSV file from $fullPath"
  
    $lines = Import-Csv $fullPath
  
    foreach ($line in $lines) {
        [string]$shouldUploadFile = $line.Execute
        [string]$localFilePath = $line.LocalPathAndFilename
        [string]$folderPath = $line.RemoteFolderSiteRelativePath
        
        if ($cleanup -eq $true) {
        Write-Info "Cleanup not implemented ..."
        return
        }

        if($shouldUploadFile -eq "Yes") {
            Write-Info "Uploading file: $localFilePath"
            if ([string]::IsNullOrEmpty($folderPath)) {
            #   Add-PnPFile -localFilePath $localFilePath 
                Write-Warning "$localFilePath does not have a designated folder. Skipping."
            }
            else {
            Add-PnPFile -Path $localFilePath -Folder $folderPath | Out-Null
            Write-Success "$localFilePath deployed to $folderPath."
            }
        } else {
            Write-Info "$localFilePath marked as skip in deployment manifest CSV."
        }
    }
}