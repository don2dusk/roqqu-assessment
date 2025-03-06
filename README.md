# Roqqu Assessment

Welcome to the Roqqu Assessment project! This README will guide you through the setup process and provide links to the live URL and Postman documentation.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation and Testing](#installation-and-testing)
- [Live URL](#live-url)
- [Postman Documentation](#postman-documentation)

## Project Overview

This project covers the Roqqu assessment, creating a comprehensive API that covers all the details as stated in the requirement document.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** >= v20.9.0
- At least _2gb_ of **available storage**

## Installation and Testing

To set up the project for local testing, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/don2dusk/roqqu-assessment.git
   ```
2. Navigate to the project directory:
   ```bash
   cd roqqu-assessment
   ```
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables. Create a `.env` file in the root directory and add the necessary environment variables:

   ```
   PORT=3000
   DATABASE_URL=file:../db/roqqu.sqlite:
   ```

5. Migrate the database to an SQLite database:

   ```bash
   npx prisma migrate dev # Will automatically create a database at the DATABASE_URL provided above
   ```

6. To start the project, run:

   ```bash
   npm start
   ```

7. Run the tests:
   ```bash
   npm test
   ```

## Live URL

You can access the live version of the project at [Live URL](http://roqqu-api.eba-cwcssbmp.us-west-2.elasticbeanstalk.com/).

## Postman Documentation

For API documentation and testing, refer to the Postman collection at [Postman Documentation](https://documenter.getpostman.com/view/25022077/2sAYdkHpMZ).
