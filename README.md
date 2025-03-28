# WTWR (What to Wear?): Back End
The back-end project is focused on creating a server for the WTWR application. You’ll gain a deeper understanding of how to work with databases, set up security and testing, and deploy web applications on a remote machine. The eventual goal is to create a server with an API and user authorization.

Sprint 12 focuses on integrating a MongoDB database to store and manage data securely. A backend server was built using Express and deployed to a remote environment. The server supports operations such as user registration and managing clothing items including adding new items liking and unliking them and deleting items.

The error handling logic was separated into its own file located in utils/errors.js to improve the clarity and maintainability of the code.

Postman was used throughout the development process to test API requests and verify the server’s responses to various user interactions. 

## Running the Project
`npm run start` — to launch the server 

`npm run dev` — to launch the server with the hot reload feature

### Testing
Before committing your code, make sure you edit the file `sprint.txt` in the root folder. The file `sprint.txt` should contain the number of the sprint you're currently working on. For ex. 12
