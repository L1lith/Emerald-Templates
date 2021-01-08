# Emerald Templates
Intelligent Template Generation & Project Management

### Getting Started
To install emerald templates run the following command in your console
```bash
npm install -g emerald-templates
```
### Template Management
There are two ways to manage your template folders, either put them all inside a "root" template folder, or add all your templates one by one.
You can add a new template root with this command
```bash
emt add-root <path>
```
Templates can be saved individually by running the following command
```bash
emt add-template <path>
```

### Configuring
Emerald templates has a lot of shiny bells and whistles. In order to make sure emerald templates is behaving the way you'd like it to, consider configuring the project.
```bash
emt configure
```

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

## Command Documentation
To list the available commands run the help command
```bash
emt help
```
To get more information about a specific command supply the command name to the help argument
```bash
emt help <command>
```

## Gems
Gems are like mini-templates inside of your template directory. They are for generating new things inside your projects after they have been created. To create a gem, inside of your template directory make a new folder called gems, and inside that make a new folder named whatever you want your gem to be called. After you have initialized your project with your template run the following command with the name of your folder inside of the "gems" folder from a terminal inside your new project directory. 
```bash
emt gem <gem-name>
```
Anything inside of your gem folder will now be copied into the root of your new project, and like during generation, any appropriate scripts will be handled by Emerald-Templates.

## Template Engine Files
Inside your template folders, any file ending with `.emerald` (this can be after their normal extension) will be run through the templating engine of your choice (chosen during the configuration step). See the corresponding template engine's documentation for more information on that. The .emerald file extension will automatically be stripped in the resulting projects when you generate them with the template.

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


## Other Features
1. Automatically install node modules :D
2. Automatically initialize the git repo
3. Run a launch command (for example to open your IDE in a newly spawned project)

Note: You can configure these features with the config command

## Known Issues
The mustache and handlebar templating libraries expect your code used to generate templates to be separate from the templates themselves, so at the moment they cannot support javascript code, only injecting your cli arguments into the template. For this reason it's currently recommend to use ejs or nunjucks if you want to use code in your templates.
