import cv2
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

import pytesseract
pytesseract.pytesseract.tesseract_cmd = 'C:\Program Files\Tesseract-OCR\\tesseract.exe'

from db_init import get_database
dbname = get_database()
collection_name = dbname["test_sheets"]

def extract_table(filename):

    # read image, convert to grayscale, thresholding the image
    img = cv2.imread(filename, 0)
    (thresh, img_bin) = cv2.threshold(img, 128, 255,cv2.THRESH_BINARY|cv2.THRESH_OTSU) #perform both global and otsu thresholding
    img_bin = 255-img_bin
    # cv2.imwrite("Image_bin.jpg",img_bin)
    # plt.axis('off')
    # plt.imshow(img_bin)

    # need morphological operations (based on shape=RECT) to detect boxes
    kernel_length = np.array(img).shape[1]//80 # Defining a kernel length [originaly 80]
    verticle_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length)) #detect all the verticle lines - EROSION
    hori_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1)) #to detect all the horizontal lines - DILATION
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)) #cv2.getStructuringElement(shape,(num_of_columns,num_of_rows))


    # Morphological operation to detect vertical lines from an image
    img_temp1 = cv2.erode(img_bin, verticle_kernel, iterations=3)
    verticle_lines_img = cv2.dilate(img_temp1, verticle_kernel, iterations=3)
    # plt.imshow(verticle_lines_img)

    # Morphological operation to detect horizontal lines from an image
    img_temp2 = cv2.erode(img_bin, hori_kernel, iterations=3)
    horizontal_lines_img = cv2.dilate(img_temp2, hori_kernel, iterations=3)
    # plt.imshow(horizontal_lines_img)

    # add these two images = only boxes
    # no info = no noise
    # Weighting parameters, this will decide the quantity of an image to be added to make a new image.
    alpha = 0.5
    beta = 1.0 - alpha
    # This function helps to add two image with specific weight parameter to get a third image as summation of two image.
    img_final_bin = cv2.addWeighted(verticle_lines_img, alpha, horizontal_lines_img, beta, 0.0)
    img_final_bin = cv2.erode(~img_final_bin, kernel, iterations=2)
    (thresh, img_final_bin) = cv2.threshold(img_final_bin, 128,255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    # plt.imshow(img_final_bin)

    def sort_contours(cnts, method="left-to-right"):
        reverse = False
        i = 0
        if method == "right-to-left" or method == "bottom-to-top":
            reverse = True
        if method == "top-to-bottom" or method == "bottom-to-top":
            i = 1
        boundingBoxes = [cv2.boundingRect(c) for c in cnts]
        (cnts, boundingBoxes) = zip(*sorted(zip(cnts, boundingBoxes),
            key=lambda b:b[1][i], reverse=reverse))
        return (cnts, boundingBoxes)

    contours, hierarchy = cv2.findContours(img_final_bin, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    (contours, boundingBoxes) = sort_contours(contours, method="top-to-bottom")

    count = 1
    idx=1
    dataframe_final=[]

    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if (w > 80 and h > 20) :
                mod = count%3
                if mod== 1:
                    new_img = img[y:y+h, x:x+w]
                    out = pytesseract.image_to_string(new_img)
                    item ={
                        "reg_no" : out,
                    }
                    collection_name.insert_one(item)
                    dataframe_final.append(out)
                    count += 1

                elif mod==0:
                    new_img = img[y:y+h, x:x+w]
                    cv2.imwrite(str(count) + '.png', new_img)
                    count += 1

                else:
                    count += 1

    arr = np.array(dataframe_final)
    arr
    # arr.tofile('data1.csv', sep = ',')
    # my_arr = arr.reshape((9,))
    # my_arr.tofile('data.csv', sep = ',')
    # df = pd.DataFrame(my_arr, columns = ['Reg No','Name','Signature'])
    # df.to_csv("test.csv")

