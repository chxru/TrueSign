from table2cell.process.attendance import process_attendance
from table2cell.process.refsheets import process_reference_sheets
from table2cell.s3 import download_image


key = "uploads/reference_sign_sheets/1694808563737/1.jpg"

arr = key.split("/")
image_type = arr[1]
unique_id = arr[2]
file_name = arr[3]

if image_type == "reference_sign_sheets":
    image_path = download_image(key, "reference")
    process_reference_sheets(unique_id, file_name, image_path)

if image_type == "attendance":
    image_path = download_image(key, "attendance")
    process_attendance(unique_id, file_name, image_path)

print("Unrecognized image type", key)
