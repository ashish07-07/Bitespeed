# Bitespeed Email and Phone Number Identification

This project is an Express.js application deployed on Google Cloud Run, which interacts with a PostgreSQL database hosted on Neon. The application provides an endpoint to identify users based on their email and phone number.

## Deployed URL

The application is deployed on Google Cloud Run and can be accessed at:

https://bitespeed-zkp4nbmxea-uc.a.run.app

## Endpoint to Test

### Identify User

POST https://bitespeed-zkp4nbmxea-uc.a.run.app/order/identify

This endpoint requires an email and phone number in the request body. You can test this endpoint using Postman or any other API testing tool.

**Example Request Body:**

```json
{
  "email": "example@example.com",
  "phonenumber": "1234567890"
}
```

Setting Up the Project Locally

Follow the steps below to set up and run the project locally:

Prerequisites
Node.js installed on your machine
PostgreSQL database setup on Neon

Here is the README content in markdown format:

markdown
Copy code

# Bitespeed Email and Phone Number Identification

This project is an Express.js application deployed on Google Cloud Run, which interacts with a PostgreSQL database hosted on Neon. The application provides an endpoint to identify users based on their email and phone number.

## Deployed URL

The application is deployed on Google Cloud Run and can be accessed at:
https://bitespeed-zkp4nbmxea-uc.a.run.app

shell
Copy code

## Endpoint to Test

### Identify User

POST https://bitespeed-zkp4nbmxea-uc.a.run.app/order/identify

arduino
Copy code
This endpoint requires an email and phone number in the request body. You can test this endpoint using Postman or any other API testing tool.

**Example Request Body:**

```json
{
  "email": "example@example.com",
  "phonenumber": "1234567890"
}
```

## Setting Up the Project Locally

Follow the steps below to set up and run the project locally:

## Prerequisites

Node.js installed on your machine
PostgreSQL database setup on Neon

## Clone the Repository

Clone the repository to your local machine using the following command:

```bash

   git clone https://github.com/ashish07-07/Bitespeed.git

```

### When new users Requests:

```json
{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}
```

### Response:

![New users](./PUBLIC/image.jpg)

### When existing user with with same primary email but diffeernt phonenumber Requests makes them a secondary users :

### Response:

![New users](./PUBLIC/image1.png)

![New users](./PUBLIC/image2.jpg)

### primary contacts turn secondary:

when 2 existing primary user requests with one priamry email and priamry phonenumber then one with the phonenumber is linked to priamry email and its linked

![New users](./PUBLIC/image3.jpg)
![New users](./PUBLIC/image4.jpg)
![New users](./PUBLIC/image5.jpg)
