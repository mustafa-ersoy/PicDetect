# PicDetect

This is a storage app similar to Google Drive, you can upload your images. Also, if you search for 'cat', it will show you all your images that has a cat inside.
It does that by running deep learning object detection model in the backend during image upload. Sample drawing is given below:

<img width="1032" alt="demo" src="https://github.com/mustafa-ersoy/PicDetect/assets/63475020/33cd338a-59f1-4f4c-8123-369af9bc0e2f">


Demo Video:

https://github.com/mustafa-ersoy/PicDetect/assets/63475020/b6a5de84-995c-46b4-a446-3333e03a24d9

**Technologies and Concepts Used:**
- Django (Python)
- Django Rest Framework (DRF)
- JWT authentication
- Rest API design
- PostgreSQL
- open-cv
- React
- React-Redux
- CSS


Before the setup, you need to have Python, node.js, npm installed.
**For Setup:**
1. open a terminal go to backend `cd backend`
2. create a virtual environment for python packages
3. run `pip install -r requirements.txt`
4. install postgresql, create a database and edit credentials at line 122 in settings.py file (name, password..)
5. run `python manage.py makemigrations`
6. run `python manage.py migrate`
7. run `python manage.py runserver`
8. open a second terminal, go to frontend `cd frontend`
9. run `npm install`
10. run `npm start`

Afther these steps, you will be able use the app in your browser
