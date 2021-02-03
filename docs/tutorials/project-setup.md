## Installation
### Node.js (& Yarn)
First install the latest **"Recommended"** version - https://nodejs.org/en/. Once done, try running to see if it's all ok
    
    npm --version


Next I'd recommend to install [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) as na alternative package manager.

    npm install --global yarn


### Node Modules

    yarn install



## Startup

    yarn start

Will Start a webpack's devserver, which allows us to go to **http://localhost:8080/**. If the page loads up, it works and you're good to go! :)

---

If you don't see exact source code in Chrome's devtools sources (for instance you don't see Class objects), check if you have **"Enable JavaScript source maps"** checked under **Devtools settings -> Sources**

