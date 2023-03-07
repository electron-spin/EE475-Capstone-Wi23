#include <Arduino.h>

void setup()
{
  // Initialize LED pin as an output.
  pinMode(2, OUTPUT);
}
 
void loop()
{
  // Set the LED HIGH
  digitalWrite(2, HIGH);
 
  // Wait for a second
  delay(1000);
 
  // Set the LED LOW
  digitalWrite(2, LOW);
 
   // Wait for a second
  delay(1000);
}