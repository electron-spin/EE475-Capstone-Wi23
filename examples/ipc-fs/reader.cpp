#include "reader.h"
#include <vector>

vector<pair<int,int>> convertToHandLandmarks(string stringLandmarks) {
    vector<pair<int,int>> landmarks(5);
    landmarks.reserve(5);

    size_t pos = 0;
    for (int i = 0; i < 5; i++) {
        size_t startX = stringLandmarks.find("X",pos);
        size_t endX = stringLandmarks.find("Y",startX);
        size_t endY = stringLandmarks.find("\n",endX);

        int x = stoi(stringLandmarks.substr(startX+2, endX-startX-3));
        int y = stoi(stringLandmarks.substr(endX+2, endY-endX-2));
        cout << "x: " << x << " y: " << y << endl;

        landmarks[i] = make_pair(x,y);

        pos = endY;
    }
    return landmarks;
}

int main(int argc, char **argv) {
    HandProcessor processor;

    while (1) {
    cout << "" << endl;
        auto start = chrono::high_resolution_clock::now();
        fstream file("../../test.txt");
        string result;
        string buf;
        if (file.is_open()) {
            // keep reopening file since it's getting modified
            // get  all 7 lines
            for (int i = 0; i < 7; i++) {
                getline(file, buf);
                result += buf + "\n";
            }
            file.close();
        }
        // auto stop = chrono::high_resolution_clock::now();
        // auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);
        //std::cout << "Time taken to read: " << duration.count() << " us" << endl << result;

        vector<pair<int,int>> landmarks = convertToHandLandmarks(result);
        processor.processHandLandmarks(landmarks);

        //struct timespec tim, tim2;
        //tim.tv_sec = 0;
        //tim.tv_nsec = 33 * 1000000UL;
        //nanosleep(&tim, &tim2);
    }
    return 0;
}