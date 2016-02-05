##Front end configuration

after pulling the repository, make sure you have bower and npm installed globally, if not then 
here are the commands :

/* Remove all older packages of node */

dpkg --get-selections | grep node
sudo apt-get remove --purge node
sudo apt-get remove --purge nodejs

/* Now install */

sudo apt-get install nodejs 
sudo apt-get install npm
sudo ln -s /usr/bin/nodejs /usr/bin/node


/* Getting started with frontend project */
 Make your virtualenvironment

 mkvirtualenv biteapp
 workon biteapp
 now in your project's base directory(the path where you see manage.py) run the following command
 
 bower install

 this will install all the dependencies in the static folder as the path is set in .bowerrc in the base directory

/* To run the project */

Make sure you have all the requirements in the requirements.txt satisfied
then while your terminal is in base dir and virtualenv activated

run the following command

python manage.py runserver

/* Small note */
While consuming rest api's on the frontend, you will often see outdated data or nothing at all at this point because we haven not migrated db tables or migrations

So you will have to use sql dump that will be provided by any backend guy, import that dump into your sql and finally run 

python manage.py makemigrations
python manage.py migrate

##BITESPACE_APP backend configuration

After pulling the repository, make sure you have the DB created in mysql with same name that is specified in the settings.py file. Grant all privileges to the specified user by the following command :

Read settings.py file, go to DATABASES dictionary and read the name of the database, user name and password

Make sure MY SQL is installed

type in the terminal :

mysql -u root -p >
Enter your password and press enter >
create database 'DBNAME IN SETTINGS.py'>
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%' WITH GRANT OPTION;
quit() >

Run python manage.py makemigrations > python manage.py migrate

Make sure you have your super user created and if not then

python manage.py createsuperuser >
Enter email,username,password 

You have your superuser

NOTE: Do not commit any db changes or migrations, to avoid this, migrations directory has been included in gitignore

Whenever you install any dependency by pip
run the following command:

pip freeze>requirements.txt



## IMPORTING DATA FROM XLS,CSV,XLSX to MYSQL DB ##

DJANGO ADMIN:

Run python manage.py runserver

Go to 127.0.0.1:8000/admin

import_export library has been used to make an admin panel based interface to upload xls,csv,xlsx files into sql. 

So just click on the model you want to populate, make sure the fields in the xlsx,xls or csv file are exactly same as the ones in your model. First field should always be id.

Click on import and upload the file and specify the file format from the dropdown.

Note the db will be stored in /var/lib/mysql directory. You can configure the mysql settings to store it to a desired location too.

And you are good to go.!

TERMINAL:

To import data from xlsx, csv,xls files from command line go to python manage.py shell
and type the following code:

>>> import tablib
>>> from import_export import resources
>>> from 'your_app'.models import models
>>> import csv

>>> Importresource = resources.modelresource_factory(model='modelname')()

>> imported_data = tablib.import_set(open('new.csv').read())

>>> result = Importedresource.import_data(imported_data, dry_run=True)

>>> print result.has_errors()
False

>>> result = Importedresource.import_data(dataset, dry_run=False)

And your data is uploaded into your db!
