# https://matplotlib.org/stable/users/explain/animations/animations.html
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker 
import numpy as np

import matplotlib.animation as animation

# Number of pixels in each dimension
SCREEN_WIDTH = 4
SCREEN_HEIGHT = 3

# How many times a row needs to be touched for each
# pixel inside to be pulsed (controls dimmability)
PIXELS_MAX_TICKS = [[0, 2, 4, 6],
                    [8, 10, 12, 14],
                    [16, 18, 20, 22]]

# How many times the pixels in each row have been
# touched (meaning how many times the row it lives
# in has been looped over). These are reset to zero 
# when each value is > than its corresponding entry
# inside `PIXELS_MAX_TICKS` (this is when it is pulsed)
PIXELS_TRACKED_TICKS = [[0, 0, 0, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]]

# These are not anything to do with the screen updating
# algorithm, just for tracking plotting data
PLOTTING_PIXELS_TIME_ENTRIES = [[[0], [0], [0], [0]],
                                [[0], [0], [0], [0]],
                                [[0], [0], [0], [0]]]

PLOTTING_PIXELS_AMPLITUDE_ENTRIES = [[[0], [0], [0], [0]],
                                     [[0], [0], [0], [0]],
                                     [[0], [0], [0], [0]]]


load_registers_bitrate  = 35 * 1000 * 1000;             # Max frequency in bits-per-second data can be clocked in
t_increment_loop        = 1 * 10**-6;                    # Use 1us by default
t_compare_duty          = 1 * 10**-6;                    # Use 1us by default
t_clock_in_1_data_bit   = 1 / load_registers_bitrate;   # Period of time it takes to clock-in 1 bit of data
t_allow_leds_to_light   = 1 * 10**-6;                    # Use 1us by default
t_increment_duty_timer  = 1 * 10**-6;                    # Use 1us by default
t_fill_row = t_increment_loop + t_compare_duty + (t_clock_in_1_data_bit*SCREEN_WIDTH) + t_allow_leds_to_light + t_increment_duty_timer;
t_current = 0


# Loop over each row and its entries. Increment the values
# for each pixel in each row inside `PIXELS_TRACKED_TICKS`
# and pulse when > than entry in `PIXELS_MAX_TICKS`
for i in range(40):
    for y in range(SCREEN_HEIGHT):

        # Take time to fill row
        t_current += t_fill_row

        for x in range(SCREEN_WIDTH):
            PIXELS_TRACKED_TICKS[y][x] += 1

            # Before checking if need to pulse or not, add a 0 amplitude sample
            PLOTTING_PIXELS_TIME_ENTRIES[y][x].append(t_current)
            PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x].append(0)

            # Check if time to pulse LED
            if PIXELS_TRACKED_TICKS[y][x] > PIXELS_MAX_TICKS[y][x]:
                # Reset tick counter for this LED since it got pulsed
                PIXELS_TRACKED_TICKS[y][x] = 0
                amplitude = 1

                # Pulsed! Add a sample at the same time as the last 0 sample
                PLOTTING_PIXELS_TIME_ENTRIES[y][x].append(t_current)
                PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x].append(1)

                # Let LED be lit for a duration
                PLOTTING_PIXELS_TIME_ENTRIES[y][x].append(t_current+t_allow_leds_to_light)
                PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x].append(1)

                # Put it back to zero afterwards
                PLOTTING_PIXELS_TIME_ENTRIES[y][x].append(t_current+t_allow_leds_to_light)
                PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x].append(0)
            else:
                # Not time to pulse, add entry for 0 amplitude at this time
                PLOTTING_PIXELS_TIME_ENTRIES[y][x].append(t_current+t_allow_leds_to_light)
                PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x].append(0)
            
            t_current += t_allow_leds_to_light
        

fig, axs = plt.subplots(SCREEN_HEIGHT, SCREEN_WIDTH, sharex=True, sharey=True)
plt.gca().xaxis.set_major_formatter(mticker.FormatStrFormatter('%.1f us'))

for y in range(SCREEN_HEIGHT):
    for x in range(SCREEN_WIDTH):
        time = [i * 10**6 for i in PLOTTING_PIXELS_TIME_ENTRIES[y][x]]
        axs[y, x].plot(time, PLOTTING_PIXELS_AMPLITUDE_ENTRIES[y][x])


# plt.plot(PLOTTING_PIXELS_TIME_ENTRIES[0][0], PLOTTING_PIXELS_AMPLITUDE_ENTRIES[0][0])
plt.show()