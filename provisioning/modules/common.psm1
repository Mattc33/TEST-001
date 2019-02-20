function Write-Head {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host ""
	Write-Host $message -BackgroundColor DarkGreen -ForegroundColor Black
}
 
function Write-Title {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host ""
	Write-Host $('-' * ($message.Length))
	Write-Host $message -BackgroundColor Blue -ForegroundColor White
	Write-Host $('-' * ($message.Length))
}

function Write-Info {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host "$message " #-NoNewline
	#Write-Host "Info" -BackgroundColor Blue -ForegroundColor White
}

function Write-Success {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host "$message " -NoNewline
	Write-Host "Success" -BackgroundColor Yellow -ForegroundColor Blue
}

function Write-Error {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host "$message " -NoNewline
	Write-Host "Error" -BackgroundColor Red -ForegroundColor Yellow
}

function Write-Warning {
	[CmdletBinding()]	
	param
	(
		[Parameter(Mandatory=$true, Position=1)]
		[string] $message
	)

	Write-Host "$message " -NoNewline
	Write-Host "Warning" -BackgroundColor Gray -ForegroundColor Black
}


