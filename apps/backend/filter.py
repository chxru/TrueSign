import cv2
import numpy as np


def get_Original(filename):
    input_img = cv2.imread(filename)
    return input_img

def get_Grayscale(filename):
    input_img = cv2.imread(filename)
    gray_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
    return gray_img

def get_Threshold(filename):
    input_img = cv2.imread(filename)
    gray_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)
    threshold_img = cv2.adaptiveThreshold(gray_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 15)
    return threshold_img

def get_Sharpen(filename):
    img = get_Grayscale(filename)
    sharpen = cv2.GaussianBlur(img, (0, 0), 3)
    sharpen = cv2.addWeighted(img, 1.5, sharpen, -0.5, 0)
    return sharpen


def get_Clahe(filename):
    gray = get_Grayscale(filename)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    clahe_img = clahe.apply(gray)
    return clahe_img

def get_Enhanced(filename):
    img = get_Original(filename)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    s = np.clip(s * 1.5, 0, 255).astype(np.uint8)
    hsv = cv2.merge((h, s, v))
    enhanced_img = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
    return enhanced_img

def get_Adjusted(filename):
    gray_img = get_Sharpen(filename)
    thresh = cv2.adaptiveThreshold(gray_img, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 10)
    median = cv2.medianBlur(thresh, 3)
    dilated = cv2.dilate(median, cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3)), iterations=1)
    inverted = cv2.bitwise_not(dilated)
    adjusted = cv2.convertScaleAbs(inverted, alpha=0.8, beta=10)
    return adjusted

def useFilter(name):
    if (name == 'grayscale'):
        return get_Grayscale
    elif (name == 'threshold'):
        return get_Threshold
    elif (name == 'sharpen'):
        return get_Sharpen
    elif (name == 'clahe'):
        return get_Clahe
    elif (name == 'enhanced'):
        return get_Enhanced
    elif (name == 'adjusted'):
        return get_Adjusted
    else:
        return get_Original

# cv2.imshow("grayscale",get_Grayscale(filename))
# cv2.imshow("threshold",get_Threshold(filename))
# cv2.imshow("sharpen",get_Sharpen(filename))
# cv2.imshow("clahe",get_Clahe(filename))
# cv2.imshow("enhanced",get_Enhanced(filename))
# cv2.imshow("adjusted",get_Adjusted(filename))
# cv2.waitKey(0)
# cv2.destroyAllWindows()
