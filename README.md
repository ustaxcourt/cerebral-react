# cerebral-react
This repository is a fork of @cerebral/react which is the react specific wrapper for cerebral, it is not the core of cerebral itself. This repository exists as cerebral and @cerebral/react are no longer maintained and are no longer compatible with React v19+. This repository's purpose is to allow minor adjustments to be made to allow React to continue to be upgraded, it is not meant to be taken on for long term feature enhancements.

Source Repository: https://github.com/cerebral/cerebral/tree/next/packages/node_modules/%40cerebral/react

## How to Publish a New Update
- Clone Repository
- Run `npm install`
- Make any changes in the `src/` directory.
- Run a project build with `npm run build`
- The build will output all files to the `lib/` directory and is meant to be under version control. The `lib/` directory is the directory other projects will download and use in node_modules/. 
- commit all files and push
- create a PR -> main 


