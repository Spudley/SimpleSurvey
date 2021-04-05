## Very Simple Survey

This is a very basic survey application using raw Javascript and PHP with no libraries or third party code at all, except Composer, to provide autoloading in PHP.

The PHP code includes a simple router written from scratch for this project that runs controller classes or renders templates directly, according to a routing config file.

The JavaScript code renders the survey questions, along with next/prev/finish buttons, and submits the results to a PHP API.

I'm aware that there are numerous areas that require better validation/error handling/security/etc. This is a proof-of-concept, not production code. Please use a framework such as Symfony or Laravel rather than this router! And likewise for the JavaScript code.

As a proof-of-concept, the survey submissions are saved simply to the PHP session, not a database.


# To run

* Clone the repo.
* `cd <project_base>`
* `composer install` (to build the autoloader)
* `cd public`
* `php -S localhost:8000 index.php`  (to run PHP's internal web server)
* Browse to `localhost:8000/survey` to see the survey page.
* Browse to `localhost:8000/api` to see a JSON dump of the survey submissions from the current PHP session.

Please do not run anywhere other than localhost: This application has is a proof-of-concept, and has no real security in it at all.

# Author

Simon Champion, April 5th 2021.

