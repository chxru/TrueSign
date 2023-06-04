import cv2
import numpy as np

def process_image(image_path: str, student_count: int, page_no: int):
    enhancedImage = enhance_Img(image_path)
    conts = find_contours(image_path)
    contours = sort_contours(conts, method="left-to-right")
    contours_final = sort_contours(contours, method="top-to-bottom")

    cell_count=63
    sorted_list = get_cells(contours_final,cell_count)
    save(sorted_list,image_path)

# def warp_Img(img, borders):
#     imgHeight, imgWidth = img.shape
#     print(imgHeight)
#     print(imgWidth)

#     topLeft = borders['topLeft']
#     topRight = borders['topRight']
#     bottomLeft = borders['bottomLeft']
#     bottomRight = borders['bottomRight']

#     tl = (topLeft['x'] * imgWidth, topLeft['y'] * imgHeight)
#     tr = (topRight['x'] * imgWidth, topRight['y'] * imgHeight)
#     bl = (bottomLeft['x'] * imgWidth, bottomLeft['y'] * imgHeight)
#     br = (bottomRight['x'] * imgWidth, bottomRight['y'] * imgHeight)

#     src_points = np.float32([tl,tr,bl,br]).reshape(4,2)
#     dst_points = np.float32([0,0],[int(imgWidth),0],[0,int(imgHeight)],[int(imgWidth),int(imgHeight)])
#     matrix = cv2.getPerspectiveTransform(src_points, dst_points)
#     warped_image = cv2.warpPerspective(img, matrix, (imgHeight, imgWidth))
#     return warped_image

def enhance_Img(image_path):
    input_img= cv2.imread(image_path)
    hsv = cv2.cvtColor(input_img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.5, 0, 255).astype(np.uint8)
    hsv = cv2.merge((h, s, v))
    enhanced_img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    return enhanced_img

def find_contours(fileName):
    gray_img = cv2.imread(fileName, 0)
    (thresh, img_bin) = cv2.threshold(gray_img, 128, 255,cv2.THRESH_BINARY|cv2.THRESH_OTSU) #perform both global and otsu thresholding
    thresh_img = 255-img_bin
    kernel_length = np.array(gray_img).shape[1]//80
    verticle_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (1, kernel_length))
    hori_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_length, 1))
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3) )
    img_temp1 = cv2.erode(thresh_img, verticle_kernel, iterations=3)
    verticle_lines_img = cv2.dilate(img_temp1, verticle_kernel, iterations=3)
    img_temp2 = cv2.erode(thresh_img, hori_kernel, iterations=3)
    horizontal_lines_img = cv2.dilate(img_temp2, hori_kernel, iterations=3)
    alpha = 0.5
    beta = 1.0 - alpha
    img_final_bin = cv2.addWeighted(verticle_lines_img, alpha, horizontal_lines_img, beta, 0.0)
    img_final_bin = cv2.erode(~img_final_bin, kernel, iterations=2)
    (thresh, img_final) = cv2.threshold(img_final_bin, 128,255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    contours, hierarchy = cv2.findContours(img_final,cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    return contours

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
	return cnts

def get_cells(cnts,cell_count):
    areaList =[]
    for c in cnts:
        propertyList = get_area(c)
        areaList.append(propertyList[4])
        indicesList = get_closest_indices(areaList,cell_count)
    final_contour_list = get_bounding_contours(indicesList, cnts)
    box_list = [cv2.boundingRect(c) for c in final_contour_list]
    return box_list

def get_bounding_contours(indices, contours):
    return [contours[i] for i in indices]

def get_area(contours):
    x, y, w, h = cv2.boundingRect(contours)
    a= cv2.contourArea(contours)
    area = np.array(a).astype(int).tolist()
    return w, y, w, h, area

def get_closest_indices(lst,cell_count):
    sorted_lst = sorted(enumerate(lst), key=lambda x: x[1])
    best_diff = float('inf')
    best_slice = []
    for i in range((len(sorted_lst))-(cell_count-1)):
        slice_diff = sorted_lst[i+(cell_count-1)][1] - sorted_lst[i][1]
        if slice_diff < best_diff:
            best_diff = slice_diff
            best_slice = sorted_lst[i:i+cell_count]
    return sorted([x[0] for x in best_slice])

def save(list,filename):
    idx = 0
    enhnced_img = enhance_Img(filename)
    for x, y, w, h in list:
        idx += 1
        cropped = enhnced_img[y:y+h, x:x+w]
        cv2.imwrite('apps/services/table2cell/table2cell/__pycache__/new/'+str(idx) + '.png', cropped)
