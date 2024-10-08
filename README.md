# Discussify

Discussify is a full-stack web application designed to facilitate discussions and interactions among users. The application features a robust backend built with Node.js and Express, and a dynamic frontend developed using React and Material-UI.

## Table of Contents

-   [Features](#features)
    -   [User Authentication](#user-authentication)
    -   [User Interaction](#user-interaction)
    -   [Content Browsing](#content-browsing)
    -   [Real-Time Features](#real-time-features)
    -   [Miscellaneous](#miscellaneous)
-   [Technologies Used](#technologies-used)
    -   [Frontend](#frontend)
    -   [Backend](#backend)
    -   [Database](#database)

## Features

### User Authentication

-   **Sign Up**: Users can create an account using their email and password.
-   **Login**: Users can log in to their accounts.
-   **OAuth**: Google OAuth integration for easy sign-in.

### User Interaction

-   **Post Management**: Users can create new posts, view existing ones, make edits to their own posts, and delete them when needed.
-   **Post Engagement**: Users can interact with posts by upvoting or downvoting them, as well as saving posts for future reference.
-   **Commenting Features**: Users have the ability to add comments, edit their own comments, and remove them if necessary.
-   **Threaded Discussions**: Users can reply to comments, allowing for nested conversations and deeper engagement.
-   **Profile Customization**: Users can update their profile information and write a personalized biography.
-   **Content Tracking**: Users can easily find their own posts, along with posts they’ve upvoted or saved.

### Content Browsing

-   **Post Browser**: Users can browse through posts.
-   **Comment Browser**: Users can browse through comments on posts.
-   **Top Posts**: Sidebar feature displaying top posts.
-   **Post Sorting**: Posts can be sorted based on votes, comments, and date created.
-   **Post Searching**: Users can search posts based on titles.

### Real-Time Features

-   **Messaging**: Real-time messaging using Socket.io.
-   **Socket.io**: Real-time updates for comments and votes.

### Miscellaneous

-   **Responsive Design**: The application is fully responsive and works on all device sizes.
-   **Dark Mode**: The application supports dark mode for a better user experience.
-   **Secure Cookies**: The application uses cookies in a secure manner for session management.

## Technologies Used

### Frontend

-   React
-   Material-UI
-   Axios
-   React Router
-   Socket.io-client

### Backend

-   Node.js
-   Express
-   Mongoose
-   Socket.io

### Database

-   MongoDB
