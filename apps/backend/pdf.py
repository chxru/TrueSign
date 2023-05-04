import os
import random
import string
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

def randomWord(length):
   letters = string.ascii_lowercase
   return ''.join(random.choice(letters) for i in range(length))

def generatePDF():
    images = os.listdir('./outputs/filtered')
    id = randomWord(10)
    pdfName = os.path.join('./outputs/', id + '.pdf')

    # append relative path to each image
    for i in range(len(images)):
        images[i] = './outputs/filtered/' + images[i]

    c = canvas.Canvas( pdfName, pagesize=letter)

    for image in images:
        c.drawImage(ImageReader(image), 0, 0, width=letter[0], height=letter[1])
        c.showPage()

    c.save()
    return id
