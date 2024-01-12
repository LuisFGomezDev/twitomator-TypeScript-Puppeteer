# Twitomator
Automate Twitter bits that should've been there from the beginning.

1. This is a small puppeteer script to extract people who liked a particular tweet and get their handles. This was used to pick 3 winners for a give away so the list is filtered by people who follow you and shuffles it before picking two 3.
2. You need to create a secrets.ts file and set the user name and password for your twitter account. It should look as follows
```
export const username = "your twitter user name"
export const password = "your password"
```
4. Deps: NPM, puppeteer, Typescript
