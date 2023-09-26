# Laravel Chirper API JWT Auth with Next.js Frontend

There are different types of API authentication systems available in the Laravel application, Like Laravel passport, Laravel sanctum and of course, you can also use JWT authentication. In this JSON Web Token Authentication for Laravel 10 tutorial, we will use JWT to create this API authentication in Laravel.

This project is trying to **use Laravel JWT API as the backend and set up authentication with Next.js as the browser frontend**. JWT API is incorporated to provide the authentication system.
When making requests using API tokens, the token should be included in the Authorization header as a Bearer token.
The Next.js React front pages are styled with Tailwind CSS to follow Laravel Breeze&apos;s default view designs. 


This project basically follows the ideas of demonstrations in [the Laravel Bootcamp](https://bootcamp.laravel.com/), and some additional features as below are added: 
- Chirper displays are loaded with scrolling pagination.
- Periodically update the Chirper display following the page is loaded.
- Mechanisms for users to follow and unfollow other users.
- The Laravel Bootcamp demonstrations provide a mechanism to send email notifications when a new Chirp is created to every other user, in this project we restrict the email notifications to the user&apos;s followers only.
    