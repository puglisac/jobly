## Jobly

Jobly is a job-search API.  Users can search for jobs and companies as well as apply for jobs.  Admins can create new jobs, create new companies, and update job application status. 

## Endpoints
### Companies

- **GET /companies**  
 Return the handle and name for all of the company objects. It also allows for the following query string parameters
 
 ```
 /companies/
  body: {"_token": token}

 ```

 **search**. If the query string parameter is passed, a filtered list of handles and names are displayed based on the search term and if the name includes it.
 
 ```
 /companies/?search=apple
 body: {"_token": token}
 ```
 
 **min\_employees**. If the query string parameter is passed, titles and company handles are displayed that have a number of employees greater than the value of the query string parameter.
 
 ```
 /companies/?min_employees=100
 body: {"_token": token}
  
 ```  
 
 **max\_employees**. If the query string parameter is passed, a list of titles and company handles are displayed that have a number of employees less than the value of the query string parameter.
If the min_employees parameter is greater than the max_employees parameter, respond with a 400 status and a message notifying that the parameters are incorrect.

 ```
 /companies/?max_employees=200
 body: {"_token": token}
  
 ``` 

- **POST /companies** 
 Create a new company and return the newly created company.
 
 ```
 /companies/
 body: { "handle": "apple",
            "name": "apple computers",
            "num_employees": 120,
            "description": "we make computers",
            "logo_url": "https://image",
            "_token": adminToken}
 ```
 
- **GET /companies/[handle]**  
Return a single company found by its id.

 ```
 /companies/apple
 body: {"_token": token}
  
 ``` 

- **PATCH /companies/[handle]**  
Update an existing company and return the updated company.

 ```
 /companies/apple
  body: { 
            "name": "new name",
            "num_employees": 120,
            "description": "we make computers",
            "logo_url": "https://newimage",
            "_token": adminToken}
 ```

- **DELETE /companies/[handle]**  
Remove an existing company and return a message.

 ```
 /companies/apple
  body: {"_token": adminToken}
 ```

### Jobs

- **POST /jobs**  
This route creates a new job and returns a new job.

 ```
 /jobs/
 body: {"title": "new job",
           "salary": 20000.00,
           "equity": 0.3,
           "company_handle": "apple",
           "_token": adminToken}
 ```

- **POST /jobs/[id]/apply**  
 Adds job to logged-in user's applications with state of application.  Accepted states: intereste, applied, accepted, rejected.
 
 ```
 /jobs/[id]/apply
 body: {"state":"applied", 
 		   "_token": token}
 ```

- **PATCH /jobs/[id]/apply**  
 Updates state of application.  Accepted states: intereste, applied, accepted, rejected.
 
 ```
 /jobs/[id]/apply
 body: {"username": "user",
 			"state":"accepted", 
 			"_token": adminToken}
 ```

- **GET /jobs**  
This route lists all the titles and company handles for all jobs, ordered by the most recently posted jobs. It  also allows for the following query string parameters.

 ```
 /jobs/
 body: {"_token": token}

 ```

 **search**: If the query string parameter is passed, a filtered list of titles and company handles are displayed based on the search term and if the job title includes it.  
 
 ```
 /jobs/?search=apple
 body: {"_token": token}
 ```
 
 
 **min_salary**: If the query string parameter is passed, titles and company handles are displayed that have a salary greater than the value of the query string parameter.  
 
 ```
 /jobs/?min_salary=40000
  body: {"_token": token}
 ```
 

 **min_equity**: If the query string parameter is passed, a list of titles and company handles are displayed that have an equity greater than the value of the query string parameter.  
 
 ```
 /jobs/?min_equity=0.3
  body: {"_token": token}
 ```

- **GET /jobs/[id]**  
This route shows information about a specific job including a key of company which is an object that contains all of the information about the company associated with it.
 
 ```
 /jobs/apple
  body: {"_token": token}
 ```

- **PATCH /jobs/[id]**  
This route updates a job by its ID and returns an the newly updated job.

 ```
 /jobs/[id]
 body: {"title": "new title",
           "salary": 40000.00,
           "equity": 0.3,
           "company_handle": "apple",
           "_token": adminToken}
 ```

- **DELETE /jobs/[id]**  
This route deletes a job and returns a message.

 ```
 /jobs/[id]
 body: {"_token": adminToken}
 ```

### Users

- **POST /users**  
Create a new user and return a JWT which includes the username and whether or not the user is an admin.

 ```
 /users
 body: {"username": "user",
           "password": "password",
           "first_name": "user",
           "last_name": "name",
           "email": "test.user@email.com",
           "photo_url": "https://image",
           "is_admin": false}
 ```


- **POST /login**  
Authenticate a user and return a JSON Web Token which contains a payload with the username and is_admin values.

 ```
 /users
 body: {"username": "newuser",
           "password": "password"}
 ```

- **GET /users**  
Return the username, first_name, last_name and email of the user objects.

 ```
 /users
 ```

- **GET /users/[username]**  
Return all the fields for a user excluding the password and an array of job applications.  

 ```
 /users/username
 ```

- **PATCH /users/[username]**  
Update an existing user and return the updated user excluding the password.

 ```
 /users/username
 body: {"first_name": "new",
           "last_name": "name",
           "email": "test.user@email.com",
           "photo_url": "https://newimage",
           "is_admin": true}
 ```

- **DELETE /users/[username]**  
Remove an existing user and return a message.

 ```
 /users/username
 body: {"_token": token}
 ```
 
### Tokens
The following routes need a valid JWT:  

- GET /jobs  
- GET /jobs/[id]  
- POST /jobs/apply  
- GET /companies  
- GET /companies/[handle]  
- PATCH /users/[username]  
- DELETE /users/[username]

The following routes need a valid JWT AND the user must be an admin:  
 
- POST /companies  
- POST /jobs  
- PATCH /jobs/apply  
- PATCH /companies/[handle]  
- DELETE /companies/[handle]  
- PATCH /jobs/[id]  
- DELETE /jobs/[id]  

## Built Using

- NodeJS - backend
- ExpressJS - framework
- PostgreSQL - database
- Node-pg - connecting to database
- JSONSchema - API validation
- Jest/Supertest - testing
- Bcrypt - password hashing
- Jsonwebtoken - JWT authentication