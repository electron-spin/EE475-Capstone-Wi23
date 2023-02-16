#include "HandProcessor.h"
#include "serial.h"

HandProcessor::HandProcessor() : vertPadding(50), brightness(5), color(0), state(0) {
    //yElevation = levelChangeThreshold * 5; // 5 is the middle level
    //previousHandLandmarks = ;
    //previousHandLandmarks->point = make_pair(-1,-1);

    levelChangeThreshold = (HEIGHT - (vertPadding*2)) / 10;

}

void HandProcessor::processHandLandmarks(vector<pair<int,int>> landmark) {
    cout << "Brightness: " << brightness << ", Color: " << color << endl;
    cout << "Pinch Length: " << getPinchDistance(landmark[0], landmark[1]) << endl;

    if (!state) { // idle
        if (isPinching(landmark[0], landmark[1])) {
            if (!isThumbLeftSide(landmark[0])) state += 3; // adjusting color (flipped)
            else state++; // adjusting brightness
            //previousHandLandmarks = landmark; // start new motion
        }
    } else if (state == 1 || state == 3) {
        if (!isPinching(landmark[0], landmark[1])) { // wait till unpinched
            state++;
        }
    } else if (state == 2) {
        if (isPinching(landmark[0], landmark[1])) {
            state = 5;
        } else {
            // adjust the brightness
            brightness = adjustValue(landmark[1]);
            //updatePadding(getPinchDistance(landmark[0], landmark[1]));
        }
    } else if (state == 4) {
        if (isPinching(landmark[0], landmark[1])) {
            state++;
        } else {
            // adjust the color
            color = adjustValue(landmark[1]);
            //updatePadding(getPinchDistance(landmark[0], landmark[1]));
        }
    } else if (state == 5) {
        //previousHandLandmarks = NULL;
        if (!isPinching(landmark[0], landmark[1])) {
            state = 0;
        }
    } else state = 0;

    this->ser_.send(brightness, color);
}

bool HandProcessor::isThumbLeftSide(pair<int,int> thumbLandmark) {
    return thumbLandmark.first < WIDTH / 2;
}

bool HandProcessor::isPinching(pair<int,int> thumbLandmark, pair<int,int> indexLandmark) {
    int xDiff = thumbLandmark.first - indexLandmark.first;
    int yDiff = thumbLandmark.second - indexLandmark.second;
    return pow(xDiff, 2) + pow(yDiff, 2) < pow(pinchThreshold, 2);
}

// Possibly deprecate
//bool HandProcessor::checkPreviousLandmarkExists() {
    //return previousHandLandmarks->point.first != -1;
//}

int HandProcessor::adjustValue(pair<int,int> indexLandmark) {
    int newValue = 10 - (indexLandmark.second - vertPadding) / levelChangeThreshold;
    if (newValue < 0) return 0;
    else if (newValue > 10) return 10;
    return newValue;
}

int HandProcessor::getPinchDistance(pair<int,int> thumbLandmark, pair<int,int> indexLandmark) {
    int xDiff = thumbLandmark.first - indexLandmark.first;
    int yDiff = thumbLandmark.second - indexLandmark.second;
    return sqrt(pow(xDiff, 2) + pow(yDiff, 2));
}

// void HandProcessor::sendToSerial(int brightness, int color) {
//     serial_data(brightness, color);
//     // Serial.write(brightness);
//     // Serial.write(color);
// }

// void HandProcessor::updatePadding(int pinchDistance) {
//     int newPadding = -pinchDistance / 3 + 162;
//     if (newPadding < 0) newPadding = 0;
//     else if (newPadding > 125) newPadding = 125;
//     vertPadding = newPadding;
//     levelChangeThreshold = (HEIGHT - (vertPadding*2)) / 10;
// }
