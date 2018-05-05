const sinon = require('sinon');
const expect = require('chai').expect;

const Logger = require('../lib');

describe('Logger', async () => {
  it('Should create a logged field with stuff', async () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    const end = logger.timed('test1', 'first test');
    expect(+logger.test1.startedAt).to.equal(+now);
    expect(logger.test1.comment).to.equal('first test');
    clock.tick(500);
    end();
    expect(+logger.test1.endedAt).to.equal(+now + 500);
    clock.restore();
  });

  it('Should correctly show message', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    logger.message('test');
    expect(logger.toString()).to.equal('{"messages":{"1970-01-01T00:00:00.000Z":"test"}}');
  });

  it('Should correctly show error', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger();
    const e = new Error('bla');
    e.stack = 'at Bla';
    logger.error(e);
    expect(logger.toString()).to.equal('{"errored":true,"error":{"stack":"at Bla","message":"bla"},"erroredAt":"1970-01-01T00:00:00.000Z"}');
  });

  it('Should correctly stringify logged', () => {
    const clock = sinon.useFakeTimers();
    const now = Date.now();

    const logger = new Logger({ name: 'test' });
    const end = logger.timed('test1', 'first test');
    clock.tick(500);
    end();
    expect(logger.toString()).to.equal('{"name":"test","test1":{"comment":"first test","startedAt":"1970-01-01T00:00:00.000Z","endedAt":"1970-01-01T00:00:00.500Z","duration":500}}');
    clock.restore();
  });

  it('Should change Buffer to base64', () => {
    const clock = sinon.useFakeTimers();
    const logger = new Logger();

    logger.message(Buffer.from('1'));
    expect(logger.toString()).to.equal('{"messages":{"1970-01-01T00:00:00.000Z":"MQ=="}}');
    clock.restore();
  });
});
