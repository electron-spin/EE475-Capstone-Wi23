import cv2
import numpy as np
import time
import HandDetectionModule as hdm
import math
import screen_brightness_control as sbc

###############################
wCam, hCam = 640, 480
###############################

capture = cv2.VideoCapture(0)
capture.set(3, wCam) # Set Display width
capture.set(4, hCam) # Set Display height
pTime = 0

detector = hdm.HandDetector(detectionCon=0.7)

while True:
    success, img = capture.read()
    # Draws the hand
    detector.findHands(img)
    lmlist = detector.findPosition(img, draw=False)
    if(len(lmlist) != 0):
        # print(lmlist[4], lmlist[8])
        x1, y1 = lmlist[4][1], lmlist[4][2]
        x2, y2 = lmlist[8][1], lmlist[8][2]
        cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

        cv2.circle(img, (x1, y1), 10, (255, 0, 0), cv2.FILLED)
        cv2.circle(img, (x2, y2), 10, (255, 0, 0), cv2.FILLED)

        # Draws a line between thumb and index and puts a dot on the center of the line
        cv2.line(img, (x1, y1), (x2, y2), (255, 255, 0), 10)
        cv2.circle(img, (cx, cy), 10, (255, 0, 0), cv2.FILLED)

        length = math.hypot(x2-x1, y2-y1)
        print(length)

        if(length < 30):
            cv2.circle(img, (cx, cy), 10, (0, 255, 0), cv2.FILLED)

    cTime = time.time()
    fps = 1/ (cTime - pTime)
    pTime = cTime

    # FPS Display
    cv2.putText(img, f'FPS: {int(fps)}', (40, 70), cv2.FONT_HERSHEY_COMPLEX,
                1, (255, 0, 0), 2)

    # Brightness Control
    brightness = sbc.list_monitors()
    print(brightness)

    cv2.imshow("Img", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break