testCase(exports, "checkDateInpuWithTodays", {
    setUp: function () {
        this.checkDateInpuWithTodays = 42;
    },

    tearDown: function () {
        teardown
    },

    "checkDateInpuWithTodays": function (test) {
        test.isFunction(some.checkDateInpuWithTodays);
        test.equals(checkDateInpuWithTodays.val, this.checkDateInpuWithTodays);
        test.done();
    }
});