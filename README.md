# 🚀 Personal RSS Reader
You can try it here:
[rss-feed-study.vercel.app](https://rss-feed-study.vercel.app/)

### Hexlet tests and linter status:
[![Actions Status](https://github.com/ilyavazhenin/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/ilyavazhenin/frontend-project-11/actions) [![Maintainability](https://api.codeclimate.com/v1/badges/6cd21f902711d00721f2/maintainability)](https://codeclimate.com/github/ilyavazhenin/frontend-project-11/maintainability) [![Lint and Build test](https://github.com/ilyavazhenin/frontend-project-11/actions/workflows/lint-build-check.yml/badge.svg)](https://github.com/ilyavazhenin/frontend-project-11/actions/workflows/lint-build-check.yml)

## What's that for?
RSS Reader is your personal place to follow RSS-feeds from websites you like. Add feeds, see posts and keep yourself updated if the feed was already added.

## Install
```
1. git clone
2. make install
3. make build
```

If you want to play with dev build, run this:
```
1. make develop
```
then check **localhost:8080** page in your browser.

## What's been used
1. **HTML**
2. **Bootstrap CSS** (with SCSS)
3. **JS ES6+** (no frameworks)
4. [on-change](https://github.com/sindresorhus/on-change) (watches changes and triggers rendering) for MVC pattern
5. **Axios** for getting data from RSS feeds
6. **yup** for validating the RSS input
7. Regular **DOMParser** web API for parsing xml data
8. [All Origins](https://github.com/Hexlet/hexlet-allorigins) for avoiding CORS problems
6. **i18next** for managing interface text and error messages
7. **Webpack**
8. **Github actions** for CI (Linter checking) 
9. **Vercel** for autodeploy after pushing and successful CI
10. Tiny piece of **Lodash** (.some method).
11. **ESLint**
