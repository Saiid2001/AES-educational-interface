# AES-Project-7 React Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## File organization
The project is divided as follows:
- `./src` contains the source scripts for the react components
- `./public` contains extra files to compile the react webapp
- `./packages.json` contains `NodeJS` informations
- `./build` contains the latest react build containing an `index.html` file that you can run for testing the webapp.


## Setup development Environment

To prepare the environment to run and test this project you must have the following installed:

1. NodeJs
2. A code editor (VScode ...)
3. git bash or any terminal supporting `npm` commands

A.  After cloning the repository, first, navigate to the project directory and install the node packages for the project with
```
cd {Project directory}
npm install
```
B. Next, you can start the app in the development mode with
```
npm start
```

C. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Compile HTML/CSS/JS files for electron app

The last build are in the `.\build` folder.
In case you want to make a new react build, while in project directory, run the following command

```
npm run build
```

## Testing the React Webpage

Open the html file located in `{project directory}\build\index.html`

> The project contains packages and libraries contributed by `React` and `NodeJS`