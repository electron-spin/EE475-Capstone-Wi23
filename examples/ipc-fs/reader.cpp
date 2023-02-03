#include <iostream>
#include <fstream>
#include <string>
#include <unistd.h>
#include <chrono>
#include <time.h>

using namespace std;

int main(int argc, char **argv) {
    // TODO: create processing object


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
        auto stop = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);
        std::cout << "Time taken to read: " << duration.count() << " us" << endl << result;

        struct timespec tim, tim2;
        tim.tv_sec = 0;
        tim.tv_nsec = 33 * 1000000UL;
        nanosleep(&tim, &tim2);
    }
    return 0;
}