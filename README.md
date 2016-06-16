###Setup
`npm install` to pull down dependencies

`npm run test` to run mocha tests

`npm start -- {file}` to launch application for a given log file


#### Create a simple console program that monitors HTTP traffic on your machine:

* Consume an actively written-to w3c-formatted HTTP access log.
* Every 10s, display in the console the sections of the web site with the most hits (a section is defined as being what's before the second '/' in a URL. i.e. the section for "http://my.site.com/pages/create' is ""http://my.site.com/pages"), as well as interesting summary statistics on the traffic as a whole.
* Make sure a user can keep the console app running and monitor traffic on their machine.
* Whenever total traffic for the past 2 minutes exceeds a certain number on average, add a message saying that “High traffic generated an alert - hits = {value}, triggered at {time}”.
* Whenever the total traffic drops again below that value on average for the past 2 minutes, add another message detailing when the alert recovered.
* Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
* Write a test for the alerting logic.
* Explain how you’d improve on this application design.

#### My Solution
* The alerting logic is based off of comparisons between a window of requests for the past two minutes and the entirety of the log, using moving average and standard deviation.
* At startup, historical requests in the log are analyzed and bucketed into epoc-seconds to gather baseline statistics.
* Changes to the file are then listened for and new requests are fed into the comparison window. The data is ingested using read streams from an offset of when we last saw a request, preventing it from having to load the entire file into memory.
* Whenever the average rate of requests within the window exceeds the lifetime average by more than a standard deviation, an alert is triggered and is displayed to the console with start time and the rate.
* After the rate has dropped down, the alert is removed and the end time is recorded to the console.
* An updating line chart of the current window allows the user to view changes as new requests come in.

#### Possible Improvements
* Decoupling the graph from the rest of the program would be a major improvement. Doing so would make unit testing simpler and would allow the program to run as a daemon when the user is not actively viewing the data.
* It would also be useful to work with rotating logs and pull in historical requests from multiple files.
* Not so much design, but more rigorous testing for each class. There are defineitly some bugs lurking around.


