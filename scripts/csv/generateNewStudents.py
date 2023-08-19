import csv
import datetime
import os
import sys
from faker import Faker

d = datetime.datetime.now()
fake = Faker()


# students have three columns as in IStudent
# studentId, name, email
def new_student():
    return {
        "studentId": "eg/"
        + d.strftime("%m")
        + d.strftime("%d")
        + "/"
        + str(fake.random_int(min=1000, max=9999)),
        "name": fake.name(),
        "email": fake.email(),
    }


def generateCSV(n: int):
    with open("./csv/students.csv", "w", newline="") as csvfile:
        fieldnames = ["studentId", "name", "email"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(n):
            writer.writerow(new_student())


if __name__ == "__main__":
    n = sys.argv[1]

    # check if n is a number
    try:
        n = int(n)
    except ValueError:
        print("n must be a number")
        sys.exit(1)

    # create directory csv if not exists
    try:
        os.mkdir("csv")
    except FileExistsError:
        pass

    generateCSV(n)
