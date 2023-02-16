#include <FastLED.h>

#define LED_PIN 32
#define NUM_LEDS 60
#define BRIGHTNESS 255
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];

void setup() {
  Serial.begin(115200);
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(BRIGHTNESS);
}

void loop() {
  
  if (Serial.available() >= 2) {
    int brightnessValue = map(Serial.read(), 0, 10, 0, 255);
    int colorValue = map(Serial.read(), 0, 10, 0, 255);
    for (int i = 0; i < NUM_LEDS; i++) {
      leds[i] = CHSV(colorValue, 0, brightnessValue);
//       switch (colorValue) {
//         case 0:
//           leds[i] = CRGB::Red;
//           break;
//         case 1:
//           leds[i] = CRGB::Green;
//           break;
//         case 2:
//           leds[i] = CRGB::Blue;
//           break;
//         // Add more cases for different colors
//       }
//       leds[i].setBrightness(brightnessValue);
    }
    FastLED.show();
  }
}
