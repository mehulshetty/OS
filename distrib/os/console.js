/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 5, currentYPosition = 2 * _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 5;
            this.currentYPosition = 2 * this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                let chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) {
                    let delChar = this.buffer.slice(-1);
                    this.buffer = this.buffer.slice(0, -1);
                    this.removeText(delChar);
                }
                else if (chr === String.fromCharCode(9)) {
                    this.buffer = _OsShell.handleTab(this.buffer);
                }
                else if ((chr === "UP") || (chr === "DOWN")) {
                    for (let bufferIndex = this.buffer.length - 1; bufferIndex >= 0; bufferIndex--) {
                        let bufferLetter = this.buffer[bufferIndex];
                        this.removeText(bufferLetter);
                    }
                    this.buffer = _OsShell.handleUpAndDown(chr);
                    for (let bufferIndex = 0; bufferIndex <= this.buffer.length - 1; bufferIndex++) {
                        let bufferLetter = this.buffer[bufferIndex];
                        this.putText(bufferLetter);
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }
        putText(fullText) {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            for (let text of fullText) {
                if (this.currentXPosition > 890) {
                    this.advanceLine();
                }
                if (text !== "") {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    let offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        }
        removeText(delChar) {
            let offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, delChar);
            this.currentXPosition = this.currentXPosition - offset;
            let rectHeight = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition + (2 * _FontHeightMargin), offset, -rectHeight);
        }
        advanceLine() {
            this.currentXPosition = 5;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            let incrementYPosition = _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;
            this.currentYPosition += incrementYPosition;
            console.log(this.currentYPosition);
            // TODO: Handle scrolling. (iProject 1)
            if (this.currentYPosition >= 650) {
                let oldCanvas = _DrawingContext.getImageData(0, this.currentYPosition, 900, -(650 - incrementYPosition));
                this.currentYPosition = 650 - incrementYPosition;
                _DrawingContext.clearRect(0, 650, 900, -(incrementYPosition + 3));
                _DrawingContext.putImageData(oldCanvas, 0, 0);
            }
        }
    }
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map