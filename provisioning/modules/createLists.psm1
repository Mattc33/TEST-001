function Start-List {
    [CmdletBinding()]
    param(
        [string] $DeployFolder,
        [string] $File,
        [object] $Step,
        [bool]   $Cleanup,
        [string] $Arg1
    ) 

    $fullPath = Join-Path -Path $DeployFolder -ChildPath $File
    Write-Info "Using CSV File from $fullPath"
    $lists = Import-Csv $fullPath
  
    foreach ($list in $lists) {
        [boolean]$execute = @{$true = $true; $false = $false}[$list.Execute -eq "Yes"]
        [string] $lsTitle = $list.Title
        [string] $lsUrl = $list.Url
        [string] $lsTemplate = $list.Template
        [boolean]$lsOnQuickLaunch = @{$true = $true; $false = $false}[$list.OnQuickLaunch -eq "Yes"]
        [boolean]$lsEnableVersioning = @{$true = $true; $false = $false}[$list.EnableVersioning -eq "Yes"]
        [boolean]$lsEnableContentTypes = @{$true = $true; $false = $false}[$list.EnableContentTypes -eq "Yes"]
        [string] $lsContentType = $list.ContentType

        if ($execute -ne $true) { 
            Write-Host "Ignoring list. Title: $lsTitle"
            continue 
        }

        if ($Cleanup -eq $true) {
            Write-Host "Deleting list. Title: $lsTitle"
            Remove-PnPList -Identity $lsTitle -Force
        }
        else {
            $list = Get-PnPList -Identity $lsUrl -ErrorAction SilentlyContinue
      
            if ($list -ne $null) {
                Write-Warning "List: $lsTitle already exists"
            }
            else {
                Write-Host "Creating list. Title: $lsTitle"
                New-PnPList -Title $lsTitle -Url $lsUrl -Template $lsTemplate -OnQuickLaunch:$lsOnQuickLaunch -EnableVersioning:$lsEnableVersioning -EnableContentTypes:$lsEnableContentTypes
                $list = Get-PnPList -Identity $lsUrl -ErrorAction SilentlyContinue
            }

            $allContentTypes = @()
            if ($lsContentType.Length -gt 0) { 
                $allContentTypes = $lsContentType.Split("|") 

                # Figure out which base content type to remove if we're doing a custom CT on the list
                $remCTypeId = $null
                $remCTypeName = $null
                if ($lsTemplate -eq "GenericList") {
                    $remCTypeId = "0x01"
                    $remCTypeName = "Item"
                }
                elseif ($lsTemplate -eq "DocumentLibrary") {
                    $remCTypeId = "0x0101"
                    $remCTypeName = "Document"
                }

                if ($remCTypeId -ne $null -and $remCTypeName -ne $null) {
                    Write-Host " removing default $remCTypeName content type"
                    Remove-PnPContentTypeFromList -List $list -ContentType $remCTypeId
                }

                foreach ($ctype in $allContentTypes) {
                    $ct = Get-PnPContentType -Identity $ctype -ErrorAction SilentlyContinue
                    Write-Host "Content Type: $($ct.Name)"

                    if ($list -ne $null -and $ct -ne $null) {
                        Write-Host " adding content type: $ctype"
                        Add-PnPContentTypeToList -List $list -ContentType $ct ##-DefaultContentType
                    }
                    else {
                        Write-Error "  Content type: $ctype not found"
                        Write-Host " "
                    }
                }
            }
        }
    }
}