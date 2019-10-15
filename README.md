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
Inside your template folders, any file ending with .emerald (this can be after their normal extension) will be run through the templating engine of your choice (chosen during the configuration step). See the corresponding template engine's documentation for more information on that. The .emerald file extension will automatically be stripped in the resulting projects when you generate them with the template.

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
```
emt list
```
Returns something like this depending on your template folders
```
Available Templates:
- basic-express, browser-extension, electron-next, next-app, npm-web, p5
```

## Known Issues
The mustache and handlebar templating libraries expect your code used to generate templates to be separate from the templates themselves, so at the moment they cannot support javascript code, only injecting your cli arguments into the template. For this reason it's currently recommend to use ejs or nunjucks if you want to use code in your templates.
