## Use chat app

This app is deployed at [https://chatapp-83c10.web.app/](https://chatapp-83c10.web.app/) for anyone to try out.


## How to run

In the project directory, you can run:
```
yarn install  # install dependencies
yarn start    # run app
```
Make sure you have [yarn](https://classic.yarnpkg.com/en/docs/install) installed
and create your own .env file with your firebase app variables.
The app should open at [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Page Hierarchy

```
app.js
+-- navbar
+-- home page
+-- login page
+-- profile page
+-- chats page
    +-- sidebar 
    |   +-- search
    |   |   +-- searchinput
    |   |   +-- searchdropdown
    |   |       +-- list<searchentry>
    |   +-- conversations
    |       +-- list<sidebarconv>
    +-- conversation
        +-- list<message>
        +-- statusindicator
        +-- chatinput

```
