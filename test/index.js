const sinon = require('sinon');
const expect = require('chai').expect;

const Logger = require('../lib');

describe('Logger', async () => {
  it('Should create a logged field with stuff', async () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    logger.timed('test1', 'first test');
    expect(+logger.test1.startedAt).to.equal(+now);
    expect(logger.test1.comment).to.equal('first test');
    clock.tick(500);
    logger.test1.end();
    expect(+logger.test1.endedAt).to.equal(+now + 500);
    clock.restore();
  });

  it('Should correctly show message', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    logger.message('test', 'comment');
    expect(logger.toString()).to.equal('{"test":{"comment":"comment","time":0}}');
  });

  it('Should correctly show error', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    const e = new Error('bla');
    e.stack = 'at Bla';
    logger.error(e);
    expect(logger.toString()).to.equal('{"errored":true,"error":{"stack":"at Bla","message":"bla"},"erroredAt":0}');
  });

  it('Should correctly stringify logged', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger('test');
    logger.timed('test1', 'first test');
    clock.tick(500);
    logger.test1.end();
    expect(logger.toString()).to.equal('{"name":"test","test1":{"comment":"first test","startedAt":0,"endedAt":500,"duration":500}}');
    clock.restore();
  });

  it('Should change Buffer to base64', () => {
    const clock = sinon.useFakeTimers();
    const logger = new Logger();

    logger.message('test', Buffer.from('1'));
    expect(logger.toString()).to.equal('{"test":{"comment":"MQ==","time":0}}');
    clock.restore();
  });
});
