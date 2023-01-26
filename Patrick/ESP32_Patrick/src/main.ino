#include <Arduino.h>
int LED_BUILTIN = 2;
void setup() {
pinMode (LED_BUILTIN, OUTPUT);
}
void loop() {
digitalWrite(LED_BUILTIN, HIGH);
delay(1000);
digitalWrite(LED_BUILTIN, LOW);
delay(1000);
}



// #include <Arduino.h>

// /* 
//  *  Author: Stephany Ayala-Cerna, 1920532 
//  *  EE 474 Summer Quarter 2022
//  *  Lab 1
//  */


// int LED_PIN = 10;       // pin assigned to the LED
// int ON_BOARD = 13;      // pin assigned to the on-board LED
// // int SPEAKER_PIN = 2;    // pin assigned to the active buzzer

// unsigned long timer;
// int counter = 0;

// // the setup function runs once when you press reset or power the board
// void setup() {
//   // initialize digital pin LED_BUILTIN as an output.
//   pinMode(LED_PIN, OUTPUT);

//   // initialize pin for on-board LED as an output.
//   pinMode(ON_BOARD, OUTPUT);

//   // initialize pin for the speaker as an output
//   // pinMode(SPEAKER_PIN, OUTPUT);
//   // steady();
// }

// // the loop function runs over and over again forever
// void loop() {
//   // initial();
//   // call alternate() function to simulate alternating LEDs
//   timer = millis();

//   // if (timer % 4 == 2) {
//   //  digitalWrite(SPEAKER_PIN, HIGH);
//   // } else if (timer % 4 == 0) {
//   //   digitalWrite(SPEAKER_PIN, LOW);
//   // }
//   // if(timer > 10000) {
//   //   digitalWrite(SPEAKER_PIN, LOW);
//   // }
//   alternate();
  
// }

// // initial function for the on board LED blinking
// void initial() {
//   digitalWrite(LED_BUILTIN, HIGH);    // turn the LED on (HIGH is the voltage level)
//   delay(1000);                        // wait for 1 second
//   digitalWrite(LED_BUILTIN, LOW);     // turn the LED off (LOW is the voltage level)
//   delay(1000);                        // wait for 1 second
// }

// // function for LEDs alternating
// void alternate() {
//   if(timer % 400 == 0) {
//   //digitalWrite(SPEAKER_PIN, HIGH); // speaker beeps when LEDs change
//   digitalWrite(ON_BOARD, HIGH);       // On Board LED off (on board LED has inverted functionality)
//   digitalWrite(LED_PIN, HIGH);        // LED on?
//                            // wait for 0.2 seconds
//   } else if (timer % 400 == 200) {
//  // digitalWrite(SPEAKER_PIN, LOW);    
//   digitalWrite(ON_BOARD, LOW);        // on board LED on
//   digitalWrite(LED_PIN, LOW);         // LED on  
//                                      // wait for 0.2 seconds
//   }
// }