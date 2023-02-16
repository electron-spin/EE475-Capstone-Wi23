import cv2
import mediapipe as mp
import time


class HandDetector():
    def __init__(self, mode=False, maxHands=2, detectionCon=0.5, trackCon=0.6):
        # the version of mediapipe on Jetson Nano doesn't have model complexity
        # self.modelComplex = modelComplexity
        self.mode = mode
        self.maxHands = maxHands
        self.detectionCon = detectionCon
        self.trackCon = trackCon

        self.mpHands = mp.solutions.hands
        self.hands = self.mpHands.Hands(self.mode, self.maxHands,
                                        self.detectionCon, self.trackCon)
        self.mpDraw = mp.solutions.drawing_utils


    def findHands(self, img, draw=True):
        imgRGB = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        self.results = self.hands.process(imgRGB)

        # Hand Mapping
        if self.results.multi_hand_landmarks:
            for handLMS in self.results.multi_hand_landmarks:
                if draw:
                    self.mpDraw.draw_landmarks(img, handLMS, self.mpHands.HAND_CONNECTIONS)
        return img


    def findPosition(self,img, handNum=0, draw=True):
        lmlist = []

        if self.results.multi_hand_landmarks:
            myHand = self.results.multi_hand_landmarks[handNum]

            # This code is for creating the circles at the various points in the hand mask
            for id, lm in enumerate(myHand.landmark):
                h, w, c = img.shape
                cx, cy = int(lm.x * w), int(lm.y * h)
                lmlist.append([id, cx, cy])
                if draw and (id == 4 or id == 8 or id == 12 or id == 16 or id == 20):
                    cv2.circle(img, (cx, cy), 10, (255, 0, 0), cv2.FILLED)

        return lmlist


def main():
    cap = cv2.VideoCapture(0)
    detector = HandDetector()

    while True:
        success, img = cap.read()
        img = detector.findHands(img)
        lmlist = detector.findPosition(img)

        cv2.imshow("Image", img)
        cv2.waitKey(1)

        # Quit Condition
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break


if __name__ == "__main__":
    main()
