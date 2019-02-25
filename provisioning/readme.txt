Overview:
=========
This folder contains powershell scripts and other files to support provisioning an environment.

- main.ps1: Loads MMS, site cols, site content types and lists (including lookup lists).  This step is generally 
short, but takes more time if more site columns, etc. are being provisioned.

You can run these over and over again and it will smartly update data by *adding* new data. For instance, you add 
a new site column called "Name". It will add it. However, it does not delete and does not seem to update anything.

In each case, open a powershell window and run the command from the command line, as in "./main", passing the 
configuration folder as the RootFolder parameter.

*******
NOTE!!!
*******
When deploying to a fresh/empty site collection, be sure to edit deployment.main first to do content types only.
Then, turn that off and do all the other steps. Otherwise, the lookup lists step will fail since they need some
content types and they won't exist first time around.

Configuration:
==============


CSV files:
==========
In the environments folder, these files control the provisioning process.

- contentTypesDef.csv: Definitions for content types, including ID, name, group, etc.

- contentTypes.csv: For adding fields to content types. This links content types to site columns via the columns' internal names.

	**NOTE: There seems to be an issue in SharePoint that if you add a note field AFTER a taxonomy / MMS field,
	you can create an unfixable guid problem. "seems" is the key word here. For safety, make sure that you
	add all the MMS fields to content types at the end.

- lookupSpLists.csv: For lists that back up a site column of type "lookup". This is only for lookup lists.


- splists.csv: All of the SharePoint lists except for lookup lists. The first row in this file (as in all the others)
   shows the purpose of each column. A few notes: 1) You can speed up the provisioning process by
   setting the first value to "No". This will skip the provisioning step for this list. 2) You can add multiple
   content types to list by delimiting them with a pipe symbol

- siteColumns.csv: For all site columns. 

- deployment.main.csv: Main set of "commands" to the provisioning logic. 

	You can make the process here faster by turning on/off specific commands by setting the value of the first
	column to "Yes" or "No"

- page_Home.csv: For adding web parts to pages. Multiple files can be created, one for each page. Probably doesn't work for 
	modern pages. Might not work at all at the moment.                    

- Webparts.csv: For configuring web parts on pages. Also not tested or debugged yet.
