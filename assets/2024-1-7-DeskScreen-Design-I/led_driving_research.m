# Clear command window
clc;

# Size of the screen and how many bits the shift registers are
screen_width = 6;
screen_height = 4;
register_bits = 16;

# required number of register units in multiplexed configuration
required_width_register_count = screen_width/register_bits;
required_height_register_count = screen_height/register_bits;


printf("Required nummber of registers:\n")
printf("\tscreen_width/register_bits\t = %d/%d = %d\n", screen_width, register_bits, required_width_register_count)
printf("\tscreen_height/register_bits\t = %d/%d = %d\n", screen_height, register_bits, required_height_register_count)


# Now it's time for some thinking. The requirement for the screen is to
# allow each individual LED to be dimmable. A simple circuit with an LED
# connected with just a single/simple PWM capable GPIO means that at some
# frequncey we want to adjust the duty cycle between 0% and 100%. 0% will
# equate to an average voltage of 0V and 100% to an average of whatever Vcc
# is.
#
# We have our first requirement, what frequncey should the LEDs be modulated at?
# and can our configuration where only a single row can be updated at a time allow
# for reaching the desired frequncey/speed? According to https://electronics.stackexchange.com/questions/79373/how-to-choose-right-pwm-frequency-for-led#:~:text=Between%2070%20and%20200%20Hz.
# a minimum frequncey of 300Hz should be OK, but faster could result in less
# visible flicker for some people. Ok, times go into turning a row of LEDs on?
# 1. Assume the microcontroller holds a 2D framebuffer with values indicating the
#    duty cycle for each LED in each row.
# 2. Since each row is updated at teh same time, loop through each LED duty cycle value in the
#    row and see if it is less than some counter that's incremented for the row
#   2a. If the duty cycle value is less than the counter, clock-in a 1 to the corresponding
#       column register
#   2b. If the duty cycle value is more than the counter, clock-in a 0 to the corresponding
#       column register
# 3. Therefore, the time it takes to update a row consists of t_increment_loop + t_compare_duty + t_clock_in_data + t_allow_led_to_light + t_increment_duty_timer
#    t_increment_loop       = unknown (up to processor speed)
#    t_compare_duty         = unknown (up to processor speed)
#    t_clock_in_1_data_bit  = unknown (up to processor speed) + 35Mhz period
#    t_allow_leds_to_light  = unknown (depending on the LEDs and circuit, if the LEDs are switched on
#                                      and back to off too quickly, may not be enough time to actually
#                                      conduct and show light. May need intentional delay)
#    t_increment_duty_timer = unknown (up to processor speed)

# First page of the datasheet says that the data transfer rate is 35MHz (Mbps): https://www.ti.com/lit/ds/symlink/tlc59283.pdf?HQS=dis-dk-null-digikeymode-dsf-pf-null-wwe&ts=1705750330994&ref_url=https%253A%252F%252Fwww.ti.com%252Fgeneral%252Fdocs%252Fsuppproductinfo.tsp%253FdistId%253D10%2526gotoUrl%253Dhttps%253A%252F%252Fwww.ti.com%252Flit%252Fgpn%252Ftlc59283
load_registers_bitrate  = 35 * 1000 * 1000;             # Max frequency in bits-per-second data can be clocked in
t_increment_loop        = 1 * 10^-6;                    # Use 1us by default
t_compare_duty          = 1 * 10^-6;                    # Use 1us by default
t_clock_in_1_data_bit   = 1 / load_registers_bitrate;   # Period of time it takes to clock-in 1 bit of data
t_allow_leds_to_light   = 1 * 10^-6;                    # Use 1us by default
t_increment_duty_timer  = 1 * 10^-6;                    # Use 1us by default
t_fill_row = t_increment_loop + t_compare_duty + (t_clock_in_1_data_bit*register_bits) + t_allow_leds_to_light + t_increment_duty_timer;

printf("\nTime it takes to fill 1 row of data: t_fill_row = %dus\n", t_fill_row*(10^6));
printf("Frequncey that one row can updated without updating others (mssing latch and blank times): %dHz\n", 1/t_fill_row);
printf("Time to update row again after updating itself and then supsequent rows: %dus\n", (t_fill_row*(10^6))*screen_height)
printf("Frequncey at which rows can be pulsed using interleaved method: %dHz\n", 1/(t_fill_row*screen_height))

# Create a framebuffer that will be populated by values of 1 byte or 0 to 255
# (provides potentially 255 light levels). Fill it with values between 0 and 255
printf("\nFramebuffer:\n");
framebuffer = zeros(screen_height, screen_width);
for y = 1:screen_height
    printf("%d: ", y);
    for x = 1:screen_width
        framebuffer(y,x) = fix(255 * (y/screen_height));
        printf("%d ", framebuffer(y,x));
    endfor
    printf("\n");
endfor
printf("\n");


# An Array of arrays where each subarray is contains more dual
# arrays corresponding to time and amplitude for each LED
% results = zeros(screen_height, screen_width);
results = {};
for y = 1:screen_height
    for x = 1:screen_width
        results{y, x} = {[], []};
    endfor
endfor

run_time = 0;
# How many times we want to run the algorithm (update LEDs in interleaved fasion and record times + amplitudes)
for i = 1:6

    # Track the times while going over every loop
    for y = 1:screen_height

        # Track time it takes to setup row
        run_time = run_time + t_increment_loop;
        run_time = run_time + t_clock_in_1_data_bit*register_bits;

        # Go through each element in the row and track the time
        # and amplitude just at the LEDs turning on
        for x = 1:screen_width
            results{y, x, 1}{1}(end+1) = run_time;
            results{y, x, 1}{2}(end+1) = 0;

            results{y, x, 1}{1}(end+1) = run_time;
            results{y, x, 1}{2}(end+1) = 1;
        endfor

        # Allow LEDs to be lit for a bit
        run_time = run_time + t_allow_leds_to_light;

        # Go through each element in the row and track the time
        # and amplitude just at the LEDs turning off
        for x = 1:screen_width
            results{y, x, 1}{1}(end+1) = run_time;
            results{y, x, 1}{2}(end+1) = 1;

            results{y, x, 1}{1}(end+1) = run_time;
            results{y, x, 1}{2}(end+1) = 0;
        endfor
    endfor
endfor

# PLOT!
plot_index = 1;
for y = 1:screen_height
    for x = 1:screen_width
        subplot(screen_height, screen_width, plot_index);
        plot_index = plot_index + 1;

        x_lo = ((x-1)/screen_width + 0.05);
        y_lo = 1-((y-1)/screen_height + 0.25);

        % axes('position', [x_lo, y_lo, 0.2, 0.2]);
        plot(results{y, x, 1}{1}, results{y, x, 1}{2});
        % axis off;
    endfor
endfor