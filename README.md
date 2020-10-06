# Emerald Templates
## Getting Started
### Installing
To install emerald templates run the following command in your console
```bash
npm install -g emerald-templates
```

### Configuring
In order to use Emerald Templates you must first supply a templates folder. This is a folder containing a bunch of subfolders (templates). Simply Run the following command, and it will help you configure emerald templates
```bash
emt configure
```
## Template Files
Inside your template folders, any file ending with `.emerald` (this can be after their normal extension) will be run through the templating engine of your choice (chosen during the configuration step). See the corresponding template engine's documentation for more information on that. The .emerald file extension will automatically be stripped in the resulting projects when you generate them with the template.

## Generating Projects
The following command can be used to generate projects from your templates
```bash
emt generate <template folder name> <output folder (relative or absolute)>
```
or you can simply leave off the generate commands
```bash
emt <template folder name> <output folder (relative or absolute)>
```
Any additional cli arguments supplied (use --) will be passed to your templates as variables
```bash
emt <template folder name> <output folder (relative or absolute)> --age 12
```

## Listing
The list command can be used to list your available templates
```bash
emt list
```
Returns something like this depending on your template folders
```
Available Templates:
- basic-express, browser-extension, electron-next, next-app, npm-web, p5
```

## Describe a Template
The following command can be run in order to get more information about a template
```bash
emt describe <template folder name>
```

## Scripting
Any file ending with `.emerald-script` will automatically be executed. If it ends with .js.emerald-script it will be ran inside the current node context, otherwise it's contents will be split by lines, and executed one by one through the command line.

## Linking
Any file ending with `.emerald-link` will be replaced with the file referenced in the first line of the link file, and have the .emerald-link extension stripped off.
For Example if we create the following link file:


File Name: `example.js.emerald-link`
Content:
```
C:\\Users\John\example1.js
```

This file will copy the file from `C:\\Users\John\example1.js` to `example.js` in the output folder.
Additionally by providing the following special values you can reference important paths.
| String                 	| Value                                                           	|
|------------------------	|-----------------------------------------------------------------	|
| {OUTPUT_FOLDER}        	| The folder the current project is being cloned to               	|
| {OUTPUT_PATH}          	| The current file being cloned's destination                     	|
| {TEMPLATE_FOLDER}      	| The template folder we're copying from                          	|
| {LINK_FOLDER}          	| The parent folder of the {OUTPUT_PATH}                          	|
| {LINK_RELATIVE_FOLDER} 	| The relative path from the {OUTPUT_FOLDER} to the {LINK_FOLDER} 	|
| {RELATIVE_PATH}        	| The relative path from the output folder to the output file     	|

## .emignore ignore file
Because Emerald-Templates treats `.gitignore` files as regular files, the `.emignore` file can be used exactly in the same way in order to tell Emerald Templates what to copy and what not to copy


## Automatically Install node_modules
You can configure it (with the configure command) to automatically install the node modules (only if there's a valid package.json) so you always have freshly updated dependencies and don't have to waste storage space in your templates (a.k.a. you can delete the node_modules folder in your template and it will be replaced upon project generation).

## Known Issues
The mustache and handlebar templating libraries expect your code used to generate templates to be separate from the templates themselves, so at the moment they cannot support javascript code, only injecting your cli arguments into the template. For this reason it's currently recommend to use ejs or nunjucks if you want to use code in your templates.
