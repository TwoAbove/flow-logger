const sinon = require('sinon');
const expect = require('chai').expect;

const Logger = require('../lib');

describe('Logger', async () => {
  it('Should create a logged field with stuff', async () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    logger.timed('test1', 'first test');
    expect(+logger.logged.test1.startedAt).to.equal(+now);
    expect(logger.logged.test1.comment).to.equal('first test');
    clock.tick(500);
    logger.logged.test1.end();
    expect(+logger.logged.test1.endedAt).to.equal(+now + 500);
    clock.restore();
  });

  it('Should correctly stringify logged', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    logger.timed('test1', 'first test');
    clock.tick(500);
    logger.logged.test1.end();
    expect(logger.toString()).to.equal('{"test1":{"comment":"first test","startedAt":0,"endedAt":500,"duration":500}}');
    clock.restore();
  });
});
