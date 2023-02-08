#include <HardwareSerial.h>

#define UART_NUM 0

HardwareSerial Uart0(UART_NUM);

void setup() 
{
  Uart0.begin(115200, SERIAL_8N1, 19, 18);
}

void loop() 
{
  if (Uart0.available()) 
  {
    int data = Uart0.read();
    Serial.println(data);
  }
}


//#include <FastLED.h>
//#include <HardwareSerial.h>
//
//#define LED_PIN 4
//#define NUM_LEDS 6
//#define BRIGHTNESS 255
//#define LED_TYPE WS2812B
//#define COLOR_ORDER GRB
//#define UART_NUM 0
//
//HardwareSerial Uart0(UART_NUM);
//CRGB leds[NUM_LEDS];
//
//void setup() 
//{
//  
////  Serial.begin(115200);
////  SerialPort.begin (115200, SERIAL_8N1, 1, 3); 
////  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
////  FastLED.setBrightness(BRIGHTNESS);
//}
//
//void loop() 
//{
//
//
//  
//////  if (Uart0.available() >= 1){
////  if (SerialPort.available()) {  
//////    Serial.print(Uart0.read());
////      SerialPort.print(1);
////  }
////  else {
////    SerialPort.print("no data received");
////  }
//////  if (Uart0.available() >= 2) 
//////  {
//////    int brightnessValue = map(Uart0.read(), 0, 10, 0, 255);
//////    int colorValue = map(Uart0.read(), 0, 10, 0, 255);
//////    for (int i = 0; i < NUM_LEDS; i++) 
//////    {
//////      leds[i] = CHSV(colorValue, 0, brightnessValue);
//////    }
//////    FastLED.show();
//////  }
//}
