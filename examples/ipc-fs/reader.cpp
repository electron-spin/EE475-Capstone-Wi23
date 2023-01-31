#include <iostream>
#include <fstream>
#include <string>
#include <unistd.h>
#include <chrono>
#include <time.h>

int main(int argc, char **argv) {
    while (1) {
    std::cout << "" << std::endl;
        auto start = std::chrono::high_resolution_clock::now();
        std::fstream file("../../test.txt");
        std::string buf;
        if (file.is_open()) {
            // keep reopening file since it's getting modified
            std::getline(file, buf);
            file.close();
        }
        auto stop = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
        std::cout << "Read: " << buf << " in " << duration.count() << " us";

        struct timespec tim, tim2;
        tim.tv_sec = 0;
        tim.tv_nsec = 33 * 1000000UL;
        nanosleep(&tim, &tim2);
    }
    return 0;
}