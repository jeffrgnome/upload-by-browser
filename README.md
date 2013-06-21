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
