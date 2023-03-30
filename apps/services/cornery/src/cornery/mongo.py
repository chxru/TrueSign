import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()


def get_db():
    """ Get database instance """
    MONGO_USERNAME = os.getenv("MONGO_USERNAME")
    MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
    MONGO_HOST = os.getenv("MONGO_HOST")

    if MONGO_HOST is None:
        raise Exception("MONGO_HOST is not set")

    if MONGO_USERNAME is None:
        raise Exception("MONGO_USERNAME is not set")

    if MONGO_PASSWORD is None:
        raise Exception("MONGO_PASSWORD is not set")

    client = MongoClient(
        f"mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}/?retryWrites=true&w=majority")

    return client['test']
