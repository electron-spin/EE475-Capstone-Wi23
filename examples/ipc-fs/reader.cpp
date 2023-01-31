#include <iostream>
#include <fstream>
#include <string>
#include <unistd.h>
#include <chrono>

int main(int argc, char **argv) {
    while (true) {
        std::cout << "Start" << std::endl;
        auto start = std::chrono::high_resolution_clock::now();
        std::fstream file("test.txt");
        std::string buf;
        if (file.is_open()) {
            // keep reopening file since it's getting modified
            std::getline(file, buf);
            file.close();
        }
        auto stop = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(stop - start);
        std::cout << "Read: " << buf << " in " << duration.count() << " us";
        sleep(1);
    }
    return 0;
}