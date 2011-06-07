define(function(require, exports, module) {
    
var oop = require("pilot/oop");
var Mirror = require("ace/worker/mirror").Mirror;
var lint = require("ace/worker/jsonlint").jsonlint;
    
var JsonWorker = exports.JsonWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
};

oop.inherits(JsonWorker, Mirror);

(function() {
    
    this.onUpdate = function() {
        var value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");
        
        // var start = new Date();
        try {
            lint.parse(value);
        } catch(e) {
            this.sender.emit("jsonlint", {
                 row: e.hash.line,
                 column: e.hash.loc.first_column,
                 text: e.str,
                 type: "error"
            });
            return;
        } finally {
            // console.log("parse time: " + (new Date() - start));
        }
        
        // all clear boss
        this.sender.emit("jsonlintclean", {});
    }
    
}).call(JsonWorker.prototype);

});
