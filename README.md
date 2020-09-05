# Dynamic Site Demo

## Overview

This repository is being used to teach how a dynamic website is created using NodeJS and Express

## How To Install

### Clone the Repo

bash

```
git clone git@github.com:timramsier/dynosite.git
```

### Install

```bash
npm install
```

### Start the Server

```bash
npm run start
```

## Project Structure

```bash
.
├── README.md
├── node_modules # location of dependencies
├── package-lock.json
├── package.json # package configuration
├── pages/ # location of page config data
│   ├── about.json
│   └── home.json
├── src/ # location of nodejs code
│   ├── server.js
│   └── templator.js
└── templates/
    └── index.template.html
```
