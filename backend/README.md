# How to get started using the development API

You can use virtual env [recommended].

```bash
cd backend
# create a sandbox for the backend
virtualenv -p /usr/local/bin/python3 env
# enter sandbox
source env/bin/activate
# set up sandbox
pip install -r requirements.txt
# run backend! Will run on port 5000.
# go to http://127.0.0.1:5000/ to see the docs!
python run.py
```

Once you are done working on the assignment run the following
command to exit the sandbox

```bash
deactivate
```

This method creates a space in which the backend can run without
clashing with any other python packages and issues on your local account. If you don't care you can run the backend in the global space as such.

```bash
cd backend
# on your local system this may just be pip and python
pip3 install -r requirements.txt
python3 run.py
```
