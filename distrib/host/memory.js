var TSOS;
(function (TSOS) {
    class Memory {
        constructor(mar = 0x00, mdr = 0x00, storage = new Array(0x300)) {
            this.mar = mar;
            this.mdr = mdr;
            this.storage = storage;
        }
        init() {
            for (let i = 0x000; i < 0x300; i++) {
                this.storage[i] = 0x00;
            }
        }
        /**
         * Returns the value in the MAR member
         */
        getMAR() {
            return this.mar;
        }
        /**
         * Sets the value in the MAR member
         * @param address the new value of the MAR member
         */
        setMAR(address) {
            this.mar = address;
        }
        /**
         * Gets the value in the MDR member
         */
        getMDR() {
            return this.mdr;
        }
        /**
         * Sets the value in the MDR member
         * @param data the new value in the MDR member
         */
        setMDR(data) {
            this.mdr = data;
        }
        /**
         * Resets the Memory
         */
        reset() {
            // Sets the MDR to 0x00
            this.setMDR(0x00);
            // Sets all the values in the memory to 0x00
            let i = 0x0000;
            for (i; i <= 0xFFFF; i++) {
                this.setMAR(i);
                this.write();
            }
            // Sets the MAR to 0x00
            this.setMAR(0x0000);
        }
        /**
         * Returns the data that is stored in the memory at the address given in the MAR
         * from the storage member to the MDR and returns it
         */
        read() {
            this.setMDR(this.storage[this.getMAR()]);
            return this.getMDR();
        }
        /**
         * Returns the data that is stored in the memory at the location given in the address
         */
        readImmediate(address) {
            return this.storage[address];
        }
        /**
         * Sets the value of the location in the storage member at the address specified
         * in the MAR to the value specified in the MDR
         */
        write() {
            this.storage[this.getMAR()] = this.getMDR();
        }
        /**
         * Returns the length of the addressable space in the storage member
         */
        getLength() {
            return this.storage.length;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map