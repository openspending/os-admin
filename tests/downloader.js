'use strict';

var nock = require('nock');
var assert = require('chai').assert;
var downloader = require('../app/scripts/services/downloader');

var
  testStrings = [
    'default page 1',
    'default page 2',
    'changed page 1'
  ];

describe('Downloader', function() {

  var page1Body = null;
  var page2Body = null;

  before(function(done) {
    nock('http://example.com/')
      .persist()
      .get('/page1')
      .reply(200, function() {
        return page1Body;
      }, {'access-control-allow-origin': '*'});

    nock('http://example.com/')
      .persist()
      .get('/page2')
      .reply(200, function() {
        return page2Body;
      }, {'access-control-allow-origin': '*'});

    done();
  });

  beforeEach(function(done) {
    page1Body = testStrings[0];
    page2Body = testStrings[1];
    done();
  });

  it('Should retrieve data', function(done) {
    downloader.get('http://example.com/page1').then(function(text) {
      assert.equal(text, page1Body);
      done();
    });
  });

  it('Should return data from cache', function(done) {
    downloader.get('http://example.com/page1').then(function(text) {
      assert.equal(text, page1Body);

      var previousPage1Body = page1Body;
      page1Body = testStrings[2];

      downloader.get('http://example.com/page1').then(function(text) {
        assert.equal(text, previousPage1Body);
        done();
      });
    });
  });

  it('Should return data bypassing cache', function(done) {
    downloader.get('http://example.com/page1').then(function(text) {
      assert.equal(text, page1Body);

      page1Body = testStrings[2];
      downloader.get('http://example.com/page1', null, true)
        .then(function(text) {
          assert.equal(text, page1Body);
          done();
        });
    });
  });

  it('Should retrieve another url', function(done) {
    downloader.get('http://example.com/page1')
      .then(function(text) {
        assert.equal(text, page1Body);
        return downloader.get('http://example.com/page2');
      })
      .then(function(text) {
        assert.equal(text, page2Body);
        done();
      });
  });

});
