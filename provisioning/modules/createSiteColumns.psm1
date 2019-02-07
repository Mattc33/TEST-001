function Start-SiteColumn {
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

  $fields = Import-Csv $fullPath

  foreach ($field in $fields) {
    $fldName = $field.FieldInternalName
    $fldTitle = $field.FieldLabel
    $groupName = $field.GroupName
    $required = Get-TranslateYesNo $field.Required

    if ($Cleanup -eq $true) {
      Write-Info "Deleting field: $($fldName)..."
      Remove-PnPField -Identity $fldName -Force
    }
    else {
      Write-Info "Creating field: $($fldName)..."
      Add-Field $fldName $fldTitle $groupName $required $field
    }
  }
}

function Test-FieldExists($fldName) {
  $fld = Get-PnPField -Identity $fldName -ErrorAction SilentlyContinue
  return ($fld -ne $null)
}

function Add-Field ($fldName, $fldTitle, $groupName, $required, $field) {
  $fldExists = Test-FieldExists $fldName
  if ($fldExists -eq $true) {
    Write-Warning "  field $($fldName) already exists"
    return
  }

  $fldId = [guid]::NewGuid().ToString("b")

  switch ($field.DataType) {
    "Text" {
      Add-TextField $fldId $fldName $fldTitle $groupName $required $field 
      break
    }
    "Number" {
      Add-NumberField $fldId $fldName $fldTitle $groupName $required $field 
      break
    }
    "Lookup" {
      Add-LookupField $fldId $fldName $fldTitle $groupName $required $field 
      break
    }
    "URL" {
      Add-URLField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "Boolean" {
      Add-BooleanField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "Note" {
      Add-NoteField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "Html" {
      Add-HtmlField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "User" {
      Add-UserField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "Choice" {
      Add-ChoiceField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "MMS" {
      $required = Get-TranslateYesNoToBool $field.Required
      Add-MMSField $fldId $fldName $fldTitle $groupName $required $field $termSetGroupName 
      break
    }
    "DateTime" {
      Add-DateTimeField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "PubImage" {
      Add-PublishingImage $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    "PubHtml" {
      Add-PubHtmlField $fldId $fldName $fldTitle $groupName $required $field
      break
    }
    default {
      Write-Error "Unsupported data type $($field.DataType)"
      break
    }
  }
}

function Add-PublishingImage ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Image' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' Sealed='TRUE' RichText='TRUE'  RichTextMode='FullHtml' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml 
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-MMSField ($fldId, $fldName, $fldTitle, $groupName, $required, $field, $termSetGroupName) {
  [boolean]$multi = Get-TranslateYesNoToBool $field.Multi
  [string]$termSetPath = "$($field.Lookup)"
  $fld = Add-PnPTaxonomyField -DisplayName $fldTitle -InternalName $fldName -TermSetPath $termSetPath -Group $groupName -MultiValue:$multi -Required:$required 
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-TextField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Text' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml 
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-NumberField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Number' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-URLField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='URL' Format='Hyperlink' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-BooleanField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Boolean'  ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-DateTimeField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  [string]$format = Get-DateFormat $field.Format

  $xml = "<Field Type='DateTime' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' Format='$format' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-NoteField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Note' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' NumLines='6' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-HtmlField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='Note' RichText='TRUE' RichTextMode='FullHtml' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' NumLines='10' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-PubHtmlField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  $xml = "<Field Type='HTML' RichText='TRUE' RichTextMode='FullHtml' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-ChoiceField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  [string]$format = $field.Format 
  if ([string]::IsNullOrEmpty($format)) {
    $format = "Dropdown"
  }

  [string]$choices = $field.Choices

  $options = ""
  $optArray = $choices.Split("|")
  foreach ($opt in $optArray) {
    $options = $options + "<CHOICE>$opt</CHOICE>"
  }
    
  $xml = "<Field Type='Choice' DisplayName='$fldTitle' ID='$fldId' Name='$fldName' Group='$groupName' Format='$format' Required='$required'><CHOICES>$options</CHOICES></Field>"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-UserField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  [bool]$multi = Get-TranslateYesNoToBool $field.Multi

  if ($multi -eq $true) {
    $xml = "<Field Type='UserMulti' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' Mult='TRUE' ShowField='ImnName' List='UserInfo' UserSelectionMode='PeopleOnly' EnforceUniqueValues='FALSE' />"
  } else {
    $xml = "<Field Type='User' ID='$fldId' Name='$fldName' Group='$groupName' DisplayName='$fldTitle' Required='$required' Mult='FALSE' ShowField='ImnName' List='UserInfo' UserSelectionMode='PeopleOnly' EnforceUniqueValues='FALSE' />"
  }
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Add-LookupField ($fldId, $fldName, $fldTitle, $groupName, $required, $field) {
  [string]$multi = Get-TranslateYesNo $field.Multi
  $temp = $field.Lookup.Split('|')
  [string]$lookupList = $temp[0]
  [string]$showField = $temp[1]
  [string]$dataType = @{$true = 'LookupMulti'; $false = 'Lookup'}[$multi -eq "TRUE"]

  $list = Get-PnPList -Identity $lookupList
  [string]$lookupListId = $list.Id

  [string]$xml = "<Field Type='$dataType' ID='$fldId' Name='$fldName' Group='$groupName' StaticName='$fldName' DisplayName='$fldTitle' ShowField='$showField' Mult='$multi' List='$lookupListId' Required='$required' UnlimitedLengthInDocumentLibrary='FALSE' SourceID='http://schemas.microsoft.com/sharepoint/v3/fields' />"
  $fld = Add-PnPFieldFromXml -FieldXml $xml
  if ($fld -ne $null) {
    Write-Success " field created..."
  }
}

function Get-TranslateYesNo($required) {
  if ($required -eq "Yes") {
    return "TRUE"
  }
  else {
    return "FALSE"
  }
}

function Get-TranslateYesNoToBool ($required) {
  if ($required -eq "Yes") {
    return $true
  }
  else {
    return $false
  }
}

function Get-DateFormat($format) {
  if ($format -eq "DateOnly") {
    return "DateOnly"
  }
  elseif ($format -eq "TimeOnly") {
    return "TimeOnly"
  }
  else {
    return "DateTime"
  }
}

