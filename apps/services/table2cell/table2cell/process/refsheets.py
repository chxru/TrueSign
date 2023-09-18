import os
from table2cell.constants import DUPLICATE_IN_REF_SHEET, MAX_COLS, MAX_ROWS
from table2cell.cv import process_image, save_image
from table2cell.db import get_ref_sheet_students, get_refsig_data
from table2cell.s3 import upload_img


def process_reference_sheets(unique_id: str, file_name: str, image_path: str):
    # file name is in format page_no.extension
    page_no = int(file_name.split(".")[0])

    # get signature sheet data
    refsig_data = get_refsig_data(unique_id, file_name)

    # fetch students for this reference sheet
    students = get_ref_sheet_students(unique_id)

    # to filter out the students who have signed in this paper
    # recreate the array with duplicates and remove other students
    # based on the page number
    # add duplicate id along with student id
    recreated_students = [
        (student_id, i % DUPLICATE_IN_REF_SHEET)
        for student_id in students
        for i in range(DUPLICATE_IN_REF_SHEET)
    ]

    signs_per_page = MAX_ROWS * MAX_COLS
    start_sign_idx = page_no * signs_per_page
    end_sign_idx = (page_no + 1) * signs_per_page

    # if end_sign_idx exceeds student_count, set it to student_count
    if end_sign_idx > len(recreated_students):
        end_sign_idx = len(recreated_students)

    # get students for this page
    recreated_students = recreated_students[start_sign_idx:end_sign_idx]

    # process image
    cells = process_image(
        image_path,
        page_no,
        end_sign_idx - start_sign_idx,
        refsig_data["borders"],
    )

    # make a folder to save processed images
    dir = (
        "./tmp/processed/reference_sign_sheets/" + unique_id + "/" + str(page_no) + "/"
    )
    os.makedirs(dir, exist_ok=True)

    import matplotlib.pyplot as plt

    for cell, student in zip(cells, recreated_students):
        student_id, duplicate_id = student
        dest = dir + student_id.replace("/", "_") + "_" + str(duplicate_id) + ".png"

        plt.imshow(cell)
        plt.title(student_id + "_" + str(duplicate_id))
        plt.show()
        # save_image(cell, dest)

        # upload image to s3
        # upload_img(
        #     dest,
        #     "refsigs/"
        #     + student_id.replace("/", "_")
        #     + "/"
        #     + str(duplicate_id)
        #     + ".png",
        # )
