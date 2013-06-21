upload-by-browser
=================

HTTP Server that lets you quickly set up a firewall proof upload / download repository.

Upload/download files over HTTP from a modern web browser (port 80 or otherwise, depending on firewall
issues you may or may not have) easily with zero authentication and no need for a client.
Your client is your browser.

IN OTHER WORDS, DON"T LEAVE THIS CRAP RUNNING IN PRODUCTION! :)
It's a quick, 10 minute use kind of tool for developers. Start it up, use it, shut it down!

Usage
-----------------
node upload-by-browser.js 80

(or another non-80 port, if desired)

Troubleshooting
-----------------
If you see this error, it typically means another web server (or process) is already using the port. Try a different number, or shut down the offender.

Static file server running at
 => http://localhost:80/
CTRL + C to shutdown

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: listen EACCES
    at errnoException (net.js:901:11)
    at Server._listen2 (net.js:1020:19)
    at listen (net.js:1061:10)
    at Server.listen (net.js:1127:5)
    at Object.<anonymous> (C:\Users\LMUser\Desktop\upload-by-browser\upload-by-b
rowser.js:44:4)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
