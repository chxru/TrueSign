from pymongo import MongoClient
def get_database():

   CONNECTION_STRING = "mongodb://localhost:27017/"
   client = MongoClient(CONNECTION_STRING,username='root', password='example')
   return client['attendance_sheet']

if __name__ == "__main__":
    dbname = get_database()    # Get the database
