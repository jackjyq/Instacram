import os
database_dir = os.path.join('db')
database_file = os.path.join(database_dir, 'test3.sqlite3')
if not os.path.exists(database_dir):
    print('Creating', database_dir)
    os.mkdir(database_dir)
if not os.path.exists(database_file):
    print('Creating', database_file)
    import ssl, urllib.request
    with urllib.request.urlopen('https://www.cse.unsw.edu.au/~cs2041/18s2/activities/instacram/test.sqlite3', context = ssl.SSLContext(ssl.PROTOCOL_TLSv1)) as response:
        db = response.read()
    with open(database_file, "wb") as f:
        f.write(db)
    
from app import app
import namespaces.post
import namespaces.auth
import namespaces.user
import namespaces.dummy

app.run(debug=True)
