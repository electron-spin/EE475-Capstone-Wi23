#include <cmath>
#include <vector>
#include <iostream>
#include "serial.h"
//#include "types.h"

using namespace std;

/**
 * @brief Used to extract meaningful information from the motion of
 * hand landmarks such as changing brightness and color values of a display.
 */
class HandProcessor {
    public:

    const int HEIGHT = 300;
    const int WIDTH = 690;

    // arbitrary distance between thumb and index finger to detect a pinch
    const int pinchThreshold = 15;

    // roughly 300 (height) / 10 (levels) = 30
    int vertPadding; // padding on both the top and bottom to ignore
    int levelChangeThreshold;

    int brightness;
    int color;

    /**
     * @brief The previous hand landmarks to compare to the current ones to
     * detect changes in motion. Initialized to -1,-1 to indicate that there
     * is no previous hand landmarks.
     */
    //HandLandmark previousHandLandmarks;

    /**
     * @brief Construct a new Hand Processor object to process hand landmarks.
     */
    HandProcessor();

    // TODO: possibly remove signficant jump checks
    /**
     * @brief Process the hand landmarks and update the brightness and color
     * values. A thumb,index pinch gesture will allow the user to adjust the
     * values. A second pinch gesture will stop any movements from adjusting
     * the values. While controlling the values, changes in elevation on the
     * left side of the screen will change the color while changes on the right
     * side will change the brightness.
     * If there's a signficant jump between a new point and previous point
     * it's interpreted as the start of a new motion. This is to prevent
     * the user from having to do perfect motions.
     * @param handLandmarks An array of pairs of ints representing the x and y
     * coordinates of the landmarks of the hand. One pair for each finger.
     * Starting from index 0, the fingers are ordered from thumb to pinky.
     */
    void processHandLandmarks(vector<pair<int,int>> handLandmark);

    private:

    // Serial object for sending data to ESP32.    
    Serial ser_;

    /**
     * @brief states: 0 = idle, 1 = pinched, adjusting brightness,
     * 2 = unpinched adjusting brightness, 3 = pinched adjusting color,
     * 4 = unpinched adjusting color, 5 = pinched back to idle
     */
    uint_fast8_t state;
    //int yElevation;

    /**
     * @brief Checks if the previous hand landmarks exists (Currently in a
     * continious motion).
     * @return true if the previous hand landmarks exist.
     * false if the previous hand landmarks don't exist.
     */
    //bool checkPreviousLandmarkExists();

    /**
     * @brief Checks if the hand is pinching with the thumb and index finger.
     * @return true if the hand is pinching. false if the hand is not pinching.
     */
    bool isPinching(pair<int,int> thumbLandmark, pair<int,int> indexLandmark);

    /**
     * @brief Checks if the the thumb is on left side of the screen.
     * @return true if the thumb is on the left side of the screen. false if
     * the thumb is on the right side of the screen.
     */
    bool isThumbLeftSide(pair<int,int> thumbLandmark);

    /**
     * @brief Calculates a value based on the current position of the
     * index finger landmark.
     * @param indexLandmark The current index finger landmarks.
     * @return The calculated value in the range 0-10.
     */
    int adjustValue(pair<int,int> indexLandmark);

    /**
     * @brief Gets the distance between thumb and index finger.
     * @param thumbLandmark The current thumb landmark.
     * @param indexLandmark The current index finger landmark.
     * @return The distance between the thumb and index finger.
     */
    int getPinchDistance(pair<int,int> thumbLandmark, pair<int,int> indexLandmark);

    /**
     * @brief Update padding based on the current pinch distance.
     */
    void updatePadding(int pinchDistance);

    /**
     * @brief Sends the brightness and color values to the esp32 arduino.
     */
    // void sendToSerial(int brightness, int color);
};
