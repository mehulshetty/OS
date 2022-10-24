/* ------------
   cpuScheduler.ts

   This virtual memory manager "allocates" and "deallocates" storage in memory..
   ------------ */
module TSOS {
    export class CpuScheduler {
        constructor(public quantum = 0x6,
                    public currentQuantum = 0x0,
                    public scheduleType = "RR") {
        }

        public schedule() {
            switch(this.scheduleType) {
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
    }
}