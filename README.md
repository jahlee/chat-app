## How to run

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Page Hierarchy

                app.js 
                   |
       ----------------------------
       |         |       |        |
   homepage   login   profile   chats 
                                  |
                        -------------------------------
                        |                             |
                     sidebar                    conversation
                        |                             |
               ------------------               -----------------
               |                |               |               |          
             search        conversations   list<messages>   chatinput 
               |                |                         
        -----------------    list<sidebarconv>
        |               |
    searchinput   searchdropdown
                            |
                    list<searchentry>

 ┌──────────────────────────────────────────────────────────┐
 │                         Chats Page                       │
 ├──────────────────────────────────────────────────────────┤
 │  ┌──────────────────────────┐   ┌──────────────────────┐ │
 │  │         Sidebar          │   │ Current Conversation │ │
 │  ├──────────────────────────┤   ├──────────────────────┤ │
 │  │         Search           │   │                      │ │
 │  │┌────────────────────────┐│   │                      │ │
 │  ││     SearchDropdown     ││   │                      │ │
 │  ││ ┌─────────────────────┐││   │                      │ │
 │  ││ │    SearchEntry1     │││   │                      │ │
 │  ││ └─────────────────────┘││   │                      │ │
 │  ││ ┌─────────────────────┐││   │                      │ │
 │  ││ │    SearchEntry2     │││   │       Messages       │ │
 │  ││ └─────────────────────┘││   │                      │ │
 │  │└────────────────────────┘│   │                      │ │
 │  │    Conversations         │   │                      │ │
 │  │┌────────────────────────┐│   │                      │ │
 │  ││  SidebarConversation   ││   │                      │ │
 │  │├────────────────────────┤│   │                      │ │
 │  ││  SidebarConversation   ││   │                      │ │
 │  │├────────────────────────┤│   │                      │ │
 │  ││  SidebarConversation   ││   ├──────────────────────┤ │
 │  │└────────────────────────┘│   │     ChatInput        │ │
 │  └──────────────────────────┘   └──────────────────────┘ │
 └──────────────────────────────────────────────────────────┘
