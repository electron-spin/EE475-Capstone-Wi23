#include "reader.h"
#include <vector>
#include <chrono>
#include <thread>

vector<pair<int,int>> convertToHandLandmarks(string stringLandmarks) {
    vector<pair<int,int>> landmarks(5);
    landmarks.reserve(5);

    size_t pos = 0;
    for (int i = 0; i < 5; i++) {
        size_t startX = stringLandmarks.find("X",pos) + 2;
        size_t endX = stringLandmarks.find("Y",startX) - 1;
        size_t startY = endX + 3;
        size_t endY = stringLandmarks.find("\n",startY);

        int x = stoi(stringLandmarks.substr(startX, endX-startX));
        int y = stoi(stringLandmarks.substr(startY, endY-startY));

        landmarks[i] = make_pair(x,y);

        pos = stringLandmarks.find("\t", endY + 2);
    }
    return landmarks;
}

int main(int argc, char **argv) {
    HandProcessor processor;

    while (1) {
    cout << "" << endl;
        fstream file("../SharedMem.txt");
        string result;
        string buf;
        if (file.is_open()) {
            // keep reopening file since it's getting modified
            // get all 7 lines
            for (int i = 0; i < 7; i++) {
                getline(file, buf);
                result += buf + "\n";
            }
            file.close();
        }

        vector<pair<int,int>> landmarks;
        try {
            landmarks = convertToHandLandmarks(result);
            processor.processHandLandmarks(landmarks);
        } catch (exception e) {
            cout << "Error: " << e.what() << endl;
        }

        // sleep for a bit to lower CPU usage
        std::this_thread::sleep_for(std::chrono::milliseconds(33));
    }
    return 0;
}
