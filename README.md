# eBookShop
An Open Source Online Book Shop with Nodejs-Express-Mongo-React 

## Technology
**Server Side**
 - JWT for authentication and role based authorization 
 - Mongoose as odm for mongodb connector 
 - Multer for file upload handler 
 - Minio for Object Storage
 - Express framework as main http handler 
 - Swagger for api document provider
 - Docker and docker-compose for better scale
 - PM2 as process manager
 - nodemailer for authorization
 - node-telegram-bot-api for telegram bot instance of this website 

 
 **Client Side**
 - Material UI as Main Component Library
 - React Redux for State Manager
 - React Router for Routing prepose in SPA 

## Use Case
this is a sample project to implement role base authentication for an e-commerce 
digital content store and demonstrate my power in java script

I thinking around an open source book store that each person can register on it and publish book or buy some books (in the first step e-books must suitable but later can change to a real media store)

**Manager**
web application manage by a user called master 
manager can create ,update ,read ,delete all of entities and archive contain

 - admin
 - book
 - user
 - permissions
 
 **Admin**

each admin can upload book to our repository as well as manager
some books are free and some other marked as premium

**User**
each user in the web can register in our website
we have 2 kind of user in this application (regular & premium)
to human verification we send code to email that he registered.
regular user can download regular file and 
premium user can download all kind of files
~~in the registration form user can introduce himself as an author and also~~
~~author can upload book and after review by admin it can add to our repository~~
