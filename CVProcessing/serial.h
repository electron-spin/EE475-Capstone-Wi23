#include <stdio.h>
#include <string.h>
#include <fcntl.h> // Contains file controls like O_RDWR
#include <errno.h> // Error integer and strerror() function
#include <unistd.h> // write(), read(), close()
#include <termios.h>

// Init serial connection to esp32
void initialize();

// Send data to esp32
void serial_data(int brightness, int color);