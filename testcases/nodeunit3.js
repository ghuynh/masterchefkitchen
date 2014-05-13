testCase(exports, "checkfridge", {
    setUp: function () {
        this.checkfridge = 42;
    },

    tearDown: function () {
        teardown
    },

    "checkfridge": function (test) {
        test.isFunction(some.checkfridge);
        test.equals(checkfridge.val, this.checkfridge);
        test.done();
    }
});