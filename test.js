/* eslint-env mocha */

'use strict';

const supertest = require('supertest');
const assert = require('assert');
const micro = require('./');

describe('micro', function() {
  it('listen', () => {
    assert('listen' in micro());
    assert(typeof micro().listen === 'function');
  });

  describe('error', function() {
    it('statusCode', () => {
      try {
        micro.error({ statusCode: 404 });
      } catch (e) {
        assert(e.statusMessage === 'Not Found');
      }
    });

    describe('statusMessage', function() {
      it('!expose', () => {
        try {
          micro.error({ statusMessage: 'test' });
        } catch (e) {
          assert(e.statusMessage !== 'test');
        }
      });

      it('expose', () => {
        try {
          micro.error({ statusMessage: 'test', expose: true });
        } catch (e) {
          assert(e.statusMessage === 'test');
        }
      });
    });

    it('args', () => {
      try {
        micro.error({ extra: 'extra attribute' });
      } catch (e) {
        assert(e.extra === 'extra attribute');
      }
    });

    it('default', () => {
      const app = micro((req, res) => {
        return Promise.reject(new Error());
      });

      return supertest(app)
        .get('/')
        .expect(500);
    });
  });

  describe('parse', function() {
    describe('buffer', function() {
      it('read', () => {
        const app = micro(req => micro.buffer(req));

        return supertest(app)
          .post('/')
          .send(Buffer.from('buffer'))
          .expect(200)
          .expect('Content-Type', /octet-stream/)
          .then(res => assert(Buffer.isBuffer(res.body)));
      });

      it('rereadable', () => {
        const app = micro(async req => {
          const b1 = await micro.buffer(req);
          const b2 = await micro.buffer(req);

          assert.deepEqual(b1, b2);

          return b1;
        });

        return supertest(app)
          .post('/')
          .send('buffer')
          .expect(200);
      });
    });

    it('text', () => {
      const app = micro(req => micro.text(req));

      return supertest(app)
        .post('/')
        .send('text')
        .expect(200)
        .expect('Content-Type', /plain/)
        .then(res => assert(res.text === 'text'));
    });

    it('json', () => {
      const app = micro(req => micro.json(req));
      const body = { a: 'b' };

      return supertest(app)
        .post('/')
        .send(body)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => assert.deepEqual(res.body, body));
    });

    it('form', () => {
      const app = micro(req => micro.form(req));

      return supertest(app)
        .post('/')
        .send('a=b')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => assert.deepEqual(res.body, { a: 'b' }));
    });

    it('error', () => {
      const app = micro(req => micro.json(req));
      const body = '{ "a:b" }';

      return supertest(app)
        .post('/')
        .send(body)
        .expect(400)
        .expect('Content-Type', /plain/);
    });
  });

  describe('response', function() {
    it('default', () => {
      const app = micro((req, res) => {
        res.setHeader('Content-Type', 'text/html');

        return '';
      });

      return supertest(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/);
    });

    it('null', () => {
      const app = micro(() => null);

      return supertest(app)
        .get('/')
        .expect(204)
        .then(res => assert(res.text === ''));
    });

    it('nok', () => {
      const app = micro((req, res) => {
        res.statusCode = 404;
        return 'Error';
      });

      return supertest(app)
        .get('/')
        .expect(404);
    });

    it('ok', () => {
      const app = micro(() => 'text');

      return supertest(app)
        .get('/')
        .expect(200);
    });
  });
});
