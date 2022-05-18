# EExp2Back  

#### a.k.a. EE-Cases-Styles-Experiments-Backend

This software was created as part of the Experimentation and Evaluation (Spring 2022) course of the BSc in Informatics at the Università della Svizzera italiana (USI) in Lugano, Switzerland.

This study focuses on the following two letter case styles: **Camel case** contains a collection of words separated by an uppercase character instead of a space. The capitalization of the first letter per word starts from the second word (e.g., thisIsCamelCase). **Kebab case**  comprises a collection of lowercase words separated by a hyphen (e.g., this-is-kebab-case). As part of our hypotheses, we wanted to test the effect of color on the readability of both cases, which we called **Color case** .

We developed a web application to extend our capacity to reach potential participants and automate the collection of results. Architectonically, we divided it into backend and frontend to separate concerns and improve maintainability.

If you wish to replicate the experiment, feel free to clone the repository.

Below you can find a description of the backend and the instructions to set it up to run the experiment.

You can also find the [source code for the frontend](https://github.com/erickgarro/EE-Cases-Styles-Experiments-Frontend) on Github.

## Backend

We created a RESTful API using Node.js version 17.8.0 and Express.js version 4.16.1.

It provides the following endpoints with their corresponding method denoted in capital letters and, if it applies, the respective parameters in the form `:paramName` (without including the colon):

- `GET /users/getId` Provides random 16-digit alphanumeric IDs

- `GET /tutorial/get/:userId` Generates a set of three pre-defined and pre-sorted questions with four options each in JS format

- `GET /questions/:userId` Receives a userID and, with a helper function, queries the local hard disk for the user pre-generated set of questions. If it does not find it, it produc a randomly sorted version of a predefined set of questions a their options which order is also randomized.

- `GET /responses/:userId` Given a user ID, read a JSON file on dis and return it as a JSON object

- `POST /responses/submit/:userId` Receives the users’ JSON responses, which come stringified in the body of the request,  then saves them on disk as JSON and CSV files with the userId  their filenames. It uses several helper functions to send  email to the researchers with both generated files as attachmen identifying the userId in the subject.

- `GET /responses/get/reports` Uses a helper function to process all the JSON files to generate in-memory three differe reports in CSV format with a timestamp appended to the filename:

    a\) `general (timestamp).csv`  
    b) `kebab_vs_camel(timestamp).csv`  
    c) `mono_vs_color(timestamp).csv`

    When it finishes, it compresses the files into a ZIP file that is then downloaded automatically to the requester’s device with the file: `EExp2 - Reports (timestamp).zip`

### Getting the source code

**For local execution:**
Open a terminal on your computer and navigate to the folder where you want to download the code. Then, type the following command:

`git clone https://github.com/erickgarro/EE-Cases-Styles-Experiments-Backend.git`

The following folders will be created
    `EE-Cases-Styles-Experiments-Backend`

**For cloud execution:**
Follow your repository provider’s instructions to create a fork within your account.

### Environmental variables

After that, these environmental variables need to be set (refer to ):  
  `MAILJET_API_KEY=<32-chars key>`
  `MAILJET_SECRET_KEY=<32-chars key>`
  `MAILJET_FROM=<sender's email>`
  `MAILJET_TO_1=<recepient 1 email>`
  `MAILJET_TO_2=<recepient 2 email>`

The enclosing `< >` denote a required value. These characters must be excluded.

**For local execution:**
Follow theses guides if you need help setting the environmental variables on your system:

- [Linux](https://www.alibabacloud.com/blog/a-guide-on-environment-variable-configuration-in-linux_59842)

- [macOS](https://support.apple.com/guide/terminal/use-environment-variables-apd382cc5fa-4f58-4449-b20a-41c53c006f8f/mac)

- [Windows](https://docs.oracle.com/en/database/oracle/machine-learning/oml4r/1.5.1/oread/creating-and-modifying-environment-variables-on-windows.html)

**For cloud execution:**
Refer to section [Backend server setup](#backend-setup).

### Mailer system

After a participant finishes the experiment, the backend sends an email to the researchers with the anonymized result files as attachments in JSON and CSV formats. This is intended to be a backup shall the data not be accessible from backend.

We used [Mailjet](https://www.mailjet.com) to handle our mailing. If you do not have an account, consider the following steps:

1. Open an account by visiting [this link](https://app.mailjet.com/signup).

2. Choose your account type. We recommend the developer account as you get a good enough free-tier.

3. Create and get your API and Secret Keys by visiting [this link](https://app.mailjet.com/account/apikeys).

#### Running the backend server locally

1. Navigate to the backend folder by typing:
   `cd EE-Cases-Styles-Experiments-Backend`

2. To download and install all the dependencies execute:  
    `yarn install`

3. To run the server run:  
    `yarn start`  

    The server is now accessible at [http://localhost:3000](http://localhost:3000)

If Yarn is not installed on your computer, follow [this guide](https://classic.yarnpkg.com/lang/en/docs/install).

#### Running the applications on the cloud

The application was optimized to run on remote servers, specifically [Digital Ocean](https://digitalocea.com/) for the backend.

You are be able to run it using other providers but you might need to modify the code accordingly.

To start, you need to fork both repositories. If you have a GitHub account follow [this guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo) if needed, otherwise, you need to clone the repositories and push them as new ones where you do your version control.

In case you do not have Git installed, follow [this guide](https://github.com/git-guides/install-git).

The application assumes two researches will receive every participant’s results individually. The code can be modified to add or remove recipients, or to stop emails from being sent altogether.

### Backend server setup[](#backend-setup)

If do not have a [Digital Ocean](https://www.digitalocean.com) account, [sign up](https://cloud.digitalocean.com/registrations/new) to get one. Then follow these steps for creating a new app in their App Platform:

1. Go to [Create a new app](https://cloud.digitalocean.com/apps/new).

2. Select your source code provider and follow the instructions to authorize Digital Ocean to access your repository and choose your  source branch. Leave "Autodeploy" selected and click *next*.

3. Edit your plan. We recommend a basic 512 MB RAM \| 1 vCPU instance, or the cheapest one at the time you follow this steps. When done, click *back* and then *next*.

4. Add your environmental variables (gotten from the Mailer system steps) as indicated in section , and click *next*.

5. Choose the global region to use for your deployment.

6. Review your selection and click on *create resources*.

7. Add your credit/debit card information and complete your order.

8. Digital Ocean will build and deploy the site for you. In the account dashboard, the deployment status will be displayed indicating if the site is up and running.

### Downloading the results files

To download the reports of your experiment, access the following REST GET endpoint:
` <backend-server-URL>[<:port number>]/responses/get/reports`

**Persistence of the responses JSON files on the backend server:**  
After a participant finishes the experiment, their responses will be stored on the backend server in JSON as CSV files. These files will be lost every time you push your commits to your source branch. Since each push triggers the build process, the virtual instance that runs your server will be destroyed and then recreated.

To consider those files the next time you request the reports via the REST endpoint, you need to add a copy of the JSON and CSV files received by email into your source code’s `/data/responses` folder. After, you have to commit and push the additions.

 <font size="2"> **Authors:**</font>
 <font size="2">Erick Garro Elizondo</font>
 <font size="2">Cindy Guerrero Toro</font>
 <font size="2">@USI, Lugano, Switzerland</font>
