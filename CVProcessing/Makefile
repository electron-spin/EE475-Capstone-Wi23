CC = g++
CFLAGS = -Wall -g -std=c++17

all: reader

reader: reader.o HandProcessor.o serial.o
	$(CC) $(CFLAGS) -o $@ $^

reader.o: reader.cpp reader.h HandProcessor.h
	$(CC) $(CFLAGS) -c $<

HandProcessor.o: HandProcessor.cpp HandProcessor.h serial.h
	$(CC) $(CFLAGS) -c $<

serial.o: serial.cpp serial.h
	$(CC) $(CFLAGS) -c $<

clean:
	rm -f *.o *.gch reader

