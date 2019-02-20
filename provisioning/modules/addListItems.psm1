function Start-ListItem {
  [CmdletBinding()]
  param(
    [string] $rootPath, 
    [string] $file, 
    [object] $line, 
    [bool]   $cleanup,
    [string] $Arg1
  )

  . "$rootPath\config\configQA.ps1"
  $termSetGroup = $TermSetGroupName 
  $listTitle = $line.Arg1

  [string] $query = "<View><Query><Where><Eq><FieldRef Name='Title'/><Value Type='Text'>{0}</Value></Eq></Where></Query></View>"
  $dataLines = Import-Csv "$rootPath/data/$file"
 
  foreach($line in $dataLines) {
    $values = @{}
    $userValue1 = @{}
    $userValue2 = @{}

    foreach($property in $line.PSObject.Properties) {
      if ([string]::IsNullOrWhiteSpace($property.Value) -or $property.Name -eq "id") {
        continue
      }

      $val = $property.Value.ToString().Trim()

      if ($property.Name -eq "EGTopNavigation") {
        $topNavQuery = [string]::Format($query, $val)
        $topNav = Get-PnPListItem -List "Top Navigation" -Query $topNavQuery -PageSize 1
        if ($topNav -ne $null) {
          $values.Add($property.Name, $topNav["ID"])
        }
        continue
      }

      if ($property.Name -eq "EGCountry" -or $property.Name -eq "EGRegion") {
        $termSetName = $null
        switch ($property.Name) {
          "EGCountry" {
            $termSetName = "Countries"
            break
          }
          "EGRegion" {
            $termSetName = "Regions"
            break
          }
        }

        if (![string]::IsNullOrWhiteSpace($termSetName)) {
          $term = Get-PnpTerm -Identity $val -TermSet $termSetName -TermGroup $termSetGroup 
          if ($term -ne $null) {
            $mmsValue = $term.Id.ToString() ## "$termSetGroup|$termSetName|$val"
            $values.Add($property.Name, $mmsValue)
          }
        }
        continue
      }
      $values.Add($property.Name, $val)
    }
    Add-PnPListItem -List $listTitle -Values $values
  }
}
