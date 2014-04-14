var is = require("vows-is");

is.suite("checkfridge 1").batch()

    .context("checkfridge")
    .topic.is("yes")
    .vow.it.should.equal("yes")

    .suite().run({
        reporter: is.reporter
    });
