import cv2
import time
import HandDetectionModule as hdm
import math
import threading

###############################
wCam, hCam = 640, 480
#wCam, hCam = 1920, 1080
fingers = {
    "THUMB": 4,
    "INDEX": 8,
    "MIDDLE": 12,
    "RING": 16,
    "PINKY": 20
}
###############################

capture = cv2.VideoCapture(0)
capture.set(3, wCam) # Set Display width
capture.set(4, hCam) # Set Display height
detector = hdm.HandDetector(detectionCon=0.75, trackCon=0.65)
open('../SharedMem.txt', 'w').close()


class ProcessThread(threading.Thread):
    def __init__(self, img):
        threading.Thread.__init__(self)
        self.img = img

    def run(self):
        pTime = 0
        startTime = -1
        currTime = time.time()

        # Process the frame here
        detector.findHands(img, draw=False)
        lmlist = detector.findPosition(img, draw=False)
        if (len(lmlist) != 0):
            with open('../SharedMem.txt', 'w') as f:
                # turn 5 finger's positions into string
                output_string = "{\n"
                for key in fingers:
                    output_string += "\t{}:\tX:{} Y:{}\n".format(key, lmlist[fingers[key]][1], lmlist[fingers[key]][2])
                output_string += "}\n"

                f.write(output_string)
                print(output_string)

            x1, y1 = lmlist[fingers["THUMB"]][1], lmlist[fingers["THUMB"]][2]
            x2, y2 = lmlist[fingers["INDEX"]][1], lmlist[fingers["INDEX"]][2]
            cx, cy = (x1 + x2) // 2, (y1 + y2) // 2

            cv2.circle(img, (x1, y1), 10, (255, 0, 0), cv2.FILLED)
            cv2.circle(img, (x2, y2), 10, (255, 0, 0), cv2.FILLED)

            # Draws a line between thumb and index and puts a dot on the center of the line
            cv2.line(img, (x1, y1), (x2, y2), (255, 255, 0), 10)
            cv2.circle(img, (cx, cy), 10, (255, 0, 0), cv2.FILLED)

            length = math.hypot(x2 - x1, y2 - y1)
            # print(length)

            if (length < 30):
                cv2.circle(img, (cx, cy), 10, (0, 255, 0), cv2.FILLED)
                if (startTime == -1):
                    startTime = time.time()
                    # print("This is wroking")
            elif (startTime != -1):
                endTime = time.time()

        cTime = time.time()
        fps = 1 / (cTime - pTime)
        pTime = cTime

        # FPS Display
        cv2.putText(img, f'FPS: {int(fps)}', (40, 70), cv2.FONT_HERSHEY_COMPLEX,
                    1, (255, 0, 0), 2)

        cv2.imshow("Img", img)


while True:
    success, img = capture.read()
    img = cv2.flip(img, 1)
    if success:
        process_thread = ProcessThread(img)
        process_thread.start()

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

capture.release()
cv2.destroyAllWindows()




