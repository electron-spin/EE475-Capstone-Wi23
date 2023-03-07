#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/uart.h"
#include "FastLED.h"
#include "led_strip.h"

#define LED_TYPE    WS2812B
#define LED_PIN     32
#define NUM_LEDS    90
#define BRIGHTNESS  255
#define COLOR_ORDER GRB

led_strip_t *strip;

void app_main() {
    // Setup UART
    uart_config_t uart_config = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE
    };
    uart_param_config(UART_NUM_0, &uart_config);
    uart_driver_install(UART_NUM_0, 1024, 1024, 0, NULL, 0);

    // Setup FastLED
    FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection(TypicalLEDStrip);
    FastLED.setBrightness(BRIGHTNESS);

    // Setup LED strip
    led_strip_config_t strip_config = LED_STRIP_DEFAULT_CONFIG(NUM_LEDS, (led_strip_dev_t) LED_TYPE, LED_PIN, 0);
    strip = led_strip_new_rmt_ws2812(&strip_config);
    led_strip_fill(strip, 0, NUM_LEDS, 0, 0, 0);

    while (1) {
        if (uart_get_buffered_data_len(UART_NUM_0) >= 2) {
            int brightnessValue = map(uart_read_bytes(UART_NUM_0, (uint8_t*)&brightnessValue, 1, portMAX_DELAY)[0], 0, 10, 0, 255);
            int colorValue = map(uart_read_bytes(UART_NUM_0, (uint8_t*)&colorValue, 1, portMAX_DELAY)[0], 0, 10, 0, 255);
            for (int i = 0; i < NUM_LEDS; i++) {
                strip->set_pixel(strip, i, CHSV(colorValue, 255, brightnessValue));
            }
            strip->refresh(strip, 100);
        }
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}
