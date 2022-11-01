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
    }
    TSOS.CpuScheduler = CpuScheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpuScheduler.js.map