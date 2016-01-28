/* BITESPACE_APP configuration */

After pulling the repository, make sure you have the DB created in mysql with same name that is specified in the settings.py file. Grant all privileges to the specified user by the following command :

GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'%' WITH GRANT OPTION;

Run python manage.py makemigrations > python manage.py migrate

Make sure you have your super user created

Run python manage.py runserver

Go to 127.0.0.1:8000/admin

I have used import_export library to make an admin panel based interface to upload xls,csv,xlsx files into sql. 

So just click on the model you want to populate, make sure the fields in the xlsx,xls or csv file are exactly same as the ones in your model. First field should always be id.

Click on import and upload the file and specify the file format from the dropdown.

Note the db will be stored in /var/lib/mysql directory. You can configure the mysql settings to store it to a desired location too.

And you are good to go.!
