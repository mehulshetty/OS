/* ------------
   cpuScheduler.ts

   The CPU Scheduler calls the CPU dispatcher when it is time to perform a context switch
   ------------ */
var TSOS;
(function (TSOS) {
    class CpuScheduler {
        constructor(quantum = 0x6, currentQuantum = 0x0, scheduleType = "RR") {
            this.quantum = quantum;
            this.currentQuantum = currentQuantum;
            this.scheduleType = scheduleType;
        }
        /**
         * Calls the CPU Dispatcher to switch context when current quantum is equal to the quantum limit
         */
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
        /**
         * Starts the CPU Dispatcher
         */
        start() {
            _CPUDispatcher.startRunning();
        }
        /**
         * Updates the wait and turnaround times for processes in the ready queue
         */
        updateWaitAndTurnaroundTime() {
            for (let processNum = 0; processNum < readyQueue.length; processNum++) {
                let currentProcess = readyQueue[processNum];
                switch (currentProcess.state) {
                    // Updates Wait and Turnaround Time for processes in the Ready state
                    case "Ready":
                        waitAndTurnaroundTimeTable[currentProcess.pid.toString()][0] =
                            waitAndTurnaroundTimeTable[currentProcess.pid.toString()][0] + 1;
                    // Updates Turnaround Time for processes in the Running state
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