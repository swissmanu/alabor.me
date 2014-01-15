---
title: Use a Logitech Harmony Hub with Ubuntu & Plex Home Theater
date: 2014-01-15 21:00
template: article.jade
comments: true
styleClass: orange
icon: icon-fast-forward
---
The [Plex Media Server](https://plex.tv/) provides an awesome feature set for managing and enjoy media in the living room. [Plex Home Theater](http://elan.plexapp.com/2013/11/23/plex-home-theater-1-0-released/) is a beautiful client available on all major operation systems and allows access to the complete media library through a fancy UI.

I love the programmable Harmony universal remote controls by Logitech. When building up my movie and game room recently, it was no question for me to use one of them to control my device zoo.

Since the [latest revision](http://www.logitech.com/en-gb/product/harmony-smart-control?crid=60) of the Logitechs remote control can talk to the PlayStation 3 and the Wii U over bluetooth, I was sure, it should be possible to control Plex Home Theater on my Ubuntu box too.

<span class="more"></span>

### Research
The idea is not new. There are forum posts in the internet, but few of them are really complete and provide a step-by-step guide.

*TL;DR*: Beside the Harmony Hub is not recognized at all without connecting it via USB to the target computer, it is necessary to modify the Bluez bluetooth stack of Ubuntu and compile it by yourself.

This article gathers all the information from various information sources and provides an *all-in-one solution* for the hack-loving geek.

### Guide
All you need is a computer with an internet connection running Ubuntu 12.04 and set up, working bluetooth adapter. Other versions of Ubuntu might work, but I have no experience here.

#### Update Bluetooth Stack & Utilities
First of all, make sure you have the latest version of `bluez` and `blueman`. Hit the command line and run:

```bash
$ sudo apt-get bluez blueman```

Now run `bluetoothd --version` and write down the version of Bluez. In the time of writing this article, version `4.98` is the latest for Ubuntu 12.04.

#### Patch and build Bluez
In order to make Bluez recognizing your Harmony Hub as a regular input device, you have to add a few lines of code to its source code and compile it by yourself.

Lets get started by downloading and unpacking Bluez' source code into your temporary directory:

```bash
$ cd /tmp
$ wget wget http://www.kernel.org/pub/linux/bluetooth/bluez-4.98.tar.gz
$ tar xvfz bluez-4.98.tar.gz
$ cd bluez-4.98```

Make sure you download the proper version you noted down above.

Now use your favorite text editor and open `input/fakehid.c`. Around line `343`, you should find the following code:

```c
static struct fake_hid fake_hid_table[] = {
        /* Sony PS3 remote device */
        {
                .vendor         = 0x054c,
                .product        = 0x0306,
                .connect        = fake_hid_common_connect,
                .disconnect     = fake_hid_common_disconnect,
                .event          = ps3remote_event,
                .setup_uinput   = ps3remote_setup_uinput,
                .devices        = NULL,
        }

        { },
};```

These lines teach Bluez how to recognize Sonys official PlayStation 3 bluetooth remote. Modify this structure and make it look like the following:

```c
static struct fake_hid fake_hid_table[] = {
        /* Sony PS3 remote device */
        {
                .vendor         = 0x054c,
                .product        = 0x0306,
                .connect        = fake_hid_common_connect,
                .disconnect     = fake_hid_common_disconnect,
                .event          = ps3remote_event,
                .setup_uinput   = ps3remote_setup_uinput,
                .devices        = NULL,
        },

        /* Logitech Harmony PS3 remote device */
        {
                .vendor         = 0x046d,
                .product        = 0xc129,
                .connect        = fake_hid_common_connect,
                .disconnect     = fake_hid_common_disconnect,
                .event          = ps3remote_event,
                .setup_uinput   = ps3remote_setup_uinput,
                .devices        = NULL,
        },

        { },
};```

Using this new information, Bluez knows how it should handle our Harmony Hub. You are ready now to compile and install the modified version of Bluez:

```bash
$ ./configure --prefix=/usr
$ make
$ sudo make install```

After a successful installation, take a short break and restart the machine. It will boot up with the patched version of the bluetooth stack. We'll repare the Harmony Hub in the meantime.

#### Prepare the Harmony Hub
Use the [MyHarmony portal](http://myharmony.com/) to configure your Harmony Hub. Simply add a PlayStation 3 to your devices and create an activity as you wish.

Now ensure you have your hub synchronized. Then connect it to your Ubuntu machine using a USB cable and give it some time to start up.

#### Pair the Hub
After the Ubuntu and the hub are up and running again, click on the bluetooth icon in the menu bar and select `Setup new Device...`. Use the wizard to pair your machine with the Harmony hub. To make the hub discoverable, fire up the activity you created in the step before. This will bring up the pairing dialog on your Harmony remote with touchscreen or on the Harmony smartphone app.

After pairing, click the bluetooth icon again and select `Devices...` which brings up a list containing all paired bluetooth devices. Pick the Harmony hub, click the  `Trust` button in the toolbar and click `Setup...` afterwards. Use the displayed wizard to connect the hub as an *Input Service* to your computer.

Finally note down the physical bluetooth address of your hub (this might be something like `00:11:22:BB:AA:CC`).

#### Map Remote Keys to actual Keys
Plex Home Theater is completly controlable using your keyboards keys. We make use of this and simply map any button on the Harmony remote to a key that PHT already understands.

Again, use your favorite text editor and open `/etc/bluetooth/input.conf`:

```bash
$ sudo vim /etc/bluetooth/input.conf```

I guess this is the first time you edit this file, so just copy-and-paste the following lines below. Make sure you replace `00:11:22:BB:AA:CC` with the physical address of your own hub (remember above?).

```
# Configuration file for the input service

# This section contains options which are not specific to any
# particular interface
[General]

# Set idle timeout (in minutes) before the connection will
# be disconnect (defaults to 0 for no timeout)
#IdleTimeout=30

# This section contains options that are specific to a device
[00:11:22:BB:AA:CC]

# Set a custom idle timeout (in minutes) for this device
IdleTimeout=1

# This section is the Harmony PS 3Remote keymap.  It is loaded when
# bluez starts.
# Use 'uinput.h' from bluez sources or '/usr/include/linux/input.h' for
# a list of possible KEY_* values.
#
[PS3 Remote Map]
# When the 'OverlayBuiltin' option is TRUE (the default), the keymap uses
# the built-in keymap as a starting point.  When FALSE, an empty keymap is
# the starting point.
#OverlayBuiltin = TRUE
0x16 = KEY_E              # EJECT
0x64 = KEY_A              # AUDIO
0x65 = KEY_Z              # ANGLE
0x63 = KEY_T              # SUBTITLE
0x0f = KEY_DELETE         # CLEAR
0x28 = KEY_GRAVE          # TIMER
0x00 = KEY_1              # NUM-1
0x01 = KEY_2              # NUM-2
0x02 = KEY_3              # NUM-3
0x03 = KEY_4              # NUM-4
0x04 = KEY_5              # NUM-5
0x05 = KEY_6              # NUM-6
0x06 = KEY_7              # NUM-7
0x07 = KEY_8              # NUM-8
0x08 = KEY_9              # NUM-9
0x09 = KEY_0              # NUM-0
0x81 = KEY_F7             # RED
0x82 = KEY_F8             # GREEN
0x80 = KEY_F9             # BLUE
0x83 = KEY_F10            # YELLOW
0x70 = KEY_I              # DISPLAY
0x1a = KEY_S              # TOP MENU
0x40 = KEY_M              # POP UP/MENU
0x0e = KEY_ESC            # RETURN
0x5c = KEY_C              # TRIANGLE/OPTIONS
0x5d = KEY_BACKSPACE      # CIRCLE/BACK
0x5f = KEY_TAB            # SQUARE/VIEW
0x5e = KEY_SPACE          # CROSS
0x54 = KEY_UP             # UP
0x56 = KEY_DOWN           # DOWN
0x57 = KEY_LEFT           # LEFT
0x55 = KEY_RIGHT          # RIGHT
0x0b = KEY_ENTER          # ENTER
0x5a = KEY_F1             # L1
0x58 = KEY_F2             # L2
0x51 = KEY_F3             # L3
0x5b = KEY_F4             # R1
0x59 = KEY_F5             # R2
0x52 = KEY_F6             # R3
0x43 = KEY_HOMEPAGE       # PS button
0x50 = KEY_INSERT         # SELECT
0x53 = KEY_HOME           # START
0x33 = KEY_R              # SCAN BACK
0x32 = KEY_P              # PLAY
0x34 = KEY_F              # SCAN FORWARD
0x30 = KEY_PAGEUP         # PREVIOUS
0x38 = KEY_STOP           # STOP
0x31 = KEY_PAGEDOWN       # NEXT
0x60 = KEY_COMMA          # SLOW/STEP BACK
0x39 = KEY_SPACE          # PAUSE
0x61 = KEY_DOT            # SLOW/STEP FORWARD
0xff = KEY_MAX```

Save and close the mappings file and restart the bluetooth stack:

```bash
$ sudo service bluetooth restart```

#### Test the remote
You should now be able to cast keystrokes with your Harmony remote. To test, ensure you have started the activity you created during the process.

Open the file browser and use the remotes directional buttons to select files. If working, open Plex Home Theater and enjoy a good movie.


### Tuning
Your Harmony treats your Ubuntu box as a PlayStation 3. This is fine since we want to use the PS3s remote commands to control Plex Home Theater. On the other hand the Harmony tries to start and shutdown your computer like a PS3 too. This could end up in some funny behaviours.

This flaw can be resolved by simply telling the Harmony that you want to keep the fake PlayStation *on* at any time.


### Improve & Contribute
I dumped this guide after a few days of research and hacking. All key parts are there and you should be able to setup your system with it.

Even though, I kindly request you to report any problems you may encounter and to contribute for a better experience for the rest of the community. Thanks! :)