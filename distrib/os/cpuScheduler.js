/* ------------
   cpuScheduler.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor(quantum = 0x6, currentQuantum = 0x0, scheduleType = "RR") {
            this.quantum = quantum;
            this.currentQuantum = currentQuantum;
            this.scheduleType = scheduleType;
        }
        schedule() {
            this.updateWaitAndTurnaroundTime();
            switch (this.scheduleType) {
                case "RR":
                    if (this.currentQuantum != this.quantum) {
                        this.currentQuantum++;
                    }
                    else {
                        this.currentQuantum = 0x0;
                        _CPUDispatcher.switchContext();
                    }
                    break;
            }
        }
        start() {
            _CPUDispatcher.startRunning();
        }
        updateWaitAndTurnaroundTime() {
            console.log("PROcesses: ", waitAndTurnaroundTimeTable);
            for (let processNum = 0; processNum < readyQueue.length; processNum++) {
                let currentProcess = readyQueue[processNum];
                switch (currentProcess.state) {
                    // Updates Wait Time
                    case "Ready":
                        waitAndTurnaroundTimeTable[currentProcess.pid.toString()][0] =
                            waitAndTurnaroundTimeTable[currentProcess.pid.toString()][0] + 1;
                    // Updates Turnaround Time
                    case "Running":
                        waitAndTurnaroundTimeTable[currentProcess.pid.toString()][1] =
                            waitAndTurnaroundTimeTable[currentProcess.pid.toString()][1] + 1;
                        break;
                }
            }
        }
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map