<h1 align="center">
🌐 Learn Language Game
</h1>
<p align="center">
MongoDB, Expressjs, React, Nodejs, Typescript
</p>



> MERN stack is the idea of using Javascript/Node for fullstack web development.
> The objective of this assignment is to create a language learning game that
helps users improve their language proficiency through interactive exercises
and activities. The game should include frontend UI components, backend
logic for scoring, and a database to store user progress and language data.

## clone or download

```terminal
$ git clone https://github.com/devaraj764/lang-learn-project.git
$ yarn # or npm i
```

## project structure

```terminal
LICENSE
package.json
server/
   package.json
   .env (to create .env, check [prepare your secret session])
client/
   package.json
...
```

# Usage (run fullstack app on your machine)

## Prerequisites

- [MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)
- [Node](https://nodejs.org/en/download/) ^10.0.0
- [npm](https://nodejs.org/en/download/package-manager/)

notice, you need client and server runs concurrently in different terminal session, in order to make them talk to each other

## Server-side usage(PORT: 3001)

### Prepare your secret

Note: If you want to change the .env configuration in server folder

optional step
```terminal
// to the root level
$ cd server
$ echo "JWT_SECRET=YOUR_JWT_SECRET" >> src/.env
$ echo "MONGODB_URI=YOUR_MONGODB_URI" >> src/.env
```

#### Start Server

```terminal
// root level
$ cd server   // go to server folder
$ npm i       // npm install packages
$ npm run start // run it locally a dist file
```

## Client-side usage(PORT: 3000)

```terminal
$ cd client          // go to client folder
$ yarn # or npm i    // npm install packages
$ npm run dev        // run it locally

// deployment for client app
$ npm run build // this will compile the react code using webpack and generate a folder called docs in the root level
$ npm run preview // this will run the files in your server
```

## Accessing the application
The website is already serving locally in your machine to access it click on link below

[website url](http://127.0.0.1:4173/)


## BUGs or comments
Email Me: deva170725@gmail.com (welcome, say hi)
