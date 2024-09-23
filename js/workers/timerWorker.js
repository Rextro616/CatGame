let seconds = 0;
let intervalId;

self.onmessage = function(e) {
    if (e.data === 'start') {
        seconds = 0;
        intervalId = setInterval(() => {
            seconds++;
            self.postMessage(seconds + " segundos."); 
        }, 1000);
    } else if (e.data === 'stop') {
        clearInterval(intervalId); 
        self.postMessage("Tiempo vivido: " + seconds + " segundos.");
    }
};
