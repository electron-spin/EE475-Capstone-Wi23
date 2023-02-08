#include <stdio.h>
#include <string.h>
#include <fcntl.h> // Contains file controls like O_RDWR
#include <errno.h> // Error integer and strerror() function
#include <unistd.h> // write(), read(), close()
#include <termios.h>
#include "stdint.h"

#ifndef SERIAL_H
#define SERIAL_H

class Serial {
private:
    struct termios tty_;
    int serial_port_;
    
public:
    // Init serial connection to esp32
    Serial();
    // clean up
    ~Serial();

    // Send data to esp32
    int send(uint8_t brightness, uint8_t color);
};

#endif // SERIAL_H
