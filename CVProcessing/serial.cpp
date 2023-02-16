#include "serial.h"

Serial::Serial() {
    struct termios &tty_ = this->tty_;
    int &serial_port_ = this->serial_port_;

    serial_port_ = open("/dev/ttyUSB0", O_RDWR);

    if (serial_port_ < 0) {
        printf("Error %i from open: %s\n", errno, strerror(errno));
        return;
    }

    tty_.c_cflag &= ~PARENB; // Clear parity bit, disabling parity (most common)
    tty_.c_cflag &= ~CSTOPB; // Clear stop field, only one stop bit used in communication (most common)
    tty_.c_cflag &= ~CSIZE; // Clear all the size bits, then use one of the statements below
    tty_.c_cflag |= CS8; // 8 bits per byte (most common)
    tty_.c_cflag &= ~CRTSCTS; // Disable RTS/CTS hardware flow control (most common)
    tty_.c_cflag |= CREAD | CLOCAL; // Turn on READ & ignore ctrl lines (CLOCAL = 1)
    tty_.c_lflag &= ~ICANON;
    tty_.c_lflag &= ~ECHO; // Disable echo
    tty_.c_lflag &= ~ECHOE; // Disable erasure
    tty_.c_lflag &= ~ECHONL; // Disable new-line echo
    tty_.c_lflag &= ~ISIG; // Disable interpretation of INTR, QUIT and SUSP
    tty_.c_iflag &= ~(IXON | IXOFF | IXANY); // Turn off s/w flow ctrl
    tty_.c_iflag &= ~(IGNBRK|BRKINT|PARMRK|ISTRIP|INLCR|IGNCR|ICRNL); // Disable any special handling of received bytes
    tty_.c_oflag &= ~OPOST; // Prevent special interpretation of output bytes (e.g. newline chars)
    tty_.c_oflag &= ~ONLCR; // Prevent conversion of newline to carriage return/line feed
    tty_.c_cc[VTIME] = 10;    // Wait for up to 1s (10 deciseconds), returning as soon as any data is received.
    tty_.c_cc[VMIN] = 0;
    cfsetispeed(&tty_, B115200);
    cfsetospeed(&tty_, B115200);

    if(tcsetattr(serial_port_, TCSANOW, &tty_) != 0) {
        printf("Error %i from tcsetattr: %s\n", errno, strerror(errno));
        return;
    }

    return;
}

Serial::~Serial() {
    close(this->serial_port_);
}

int Serial::send(uint8_t brightness, uint8_t color){
    uint8_t msg[] = { brightness, color };

    return write(this->serial_port_, msg, sizeof(msg));
}

