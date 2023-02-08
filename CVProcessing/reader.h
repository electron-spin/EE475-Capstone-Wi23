#include <fstream>
#include <string>
#include "HandProcessor.h"
#include "serial.h"
#include <chrono>
#include <time.h>
//#include <unistd.h>

/**
 * @brief Converts a string of landmarks to a Handlandmarks array.
 * @param stringLandmarks The string of landmarks to convert.
 * @return HandLandmarks The converted HandLandmarks array.
 */
vector<pair<int,int>> convertToHandLandmarks(string stringLandmarks);
