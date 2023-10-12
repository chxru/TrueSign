import os
from table2cell.constants import MAX_COLS, MAX_ROWS
from table2cell.cv import process_image, save_image
from table2cell.db import get_attendance_data, get_students_id_list
from table2cell.s3 import upload_img


def process_attendance(attendance_id: str, file_name: str, image_path: str):
    # file name is in format page_no.extension
    page_no = int(file_name.split(".")[0])

    # get attendance data from database
    attendance_data = get_attendance_data(attendance_id)
    students = get_students_id_list(attendance_data["moduleId"])
    student_count = len(students)

    max_signs_per_page = MAX_COLS * MAX_ROWS
    start_sign_idx = (page_no) * max_signs_per_page
    end_sign_idx = (page_no + 1) * max_signs_per_page

    # if end_sign_idx exceeds student_count, set it to student_count
    if end_sign_idx > student_count:
        end_sign_idx = student_count

    # get students for this page
    students = students[start_sign_idx:end_sign_idx]

    # process image
    cells = process_image(
        image_path,
        page_no,
        end_sign_idx - start_sign_idx,
        attendance_data["originalImages"][file_name.replace(".", "_")]["borders"],
    )

    # make a folder to save processed images
    dest_dir = "/tmp/processed/attendance/" + attendance_id + "/" + str(page_no) + "/"
    os.makedirs(dest_dir, exist_ok=True)

    for cell, student in zip(cells, students):
        save_image(cell, dest_dir + student.replace("/", "_") + ".png")

    # upload image to s3
    for file_name in os.listdir(dest_dir):
        file_path = dest_dir + file_name
        dest_name = "extracted_signs/" + attendance_id + "/" + file_path.split("/")[-1]
        upload_img(file_path, dest_name)
