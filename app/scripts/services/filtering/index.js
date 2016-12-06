'use strict';

var _ = require('lodash');

function filterByPublishingStatus(items, filterValue) {
  if (['published', 'hidden'].indexOf(filterValue) == -1) {
    return items;
  }
  return _.filter(items, function(item) {
    return (
      ((filterValue == 'published') && item.isPublished) ||
      ((filterValue == 'hidden') && !item.isPublished)
    );
  });
}

function filterByLoadingStatus(items, filterValue) {
  if (['loaded', 'loading', 'failed'].indexOf(filterValue) == -1) {
    return items;
  }
  return _.filter(items, function(item) {
    var status = item.loadingStatus;
    if (!status) {
      return false;
    }
    return (
      ((filterValue == 'loaded') && status.loaded) ||
      ((filterValue == 'failed') && status.failed) ||
      ((filterValue == 'loading') && !status.loaded && !status.failed)
    );
  });
}

function getMetrics(items) {
  var result = {
    total: 0,
    published: 0,
    hidden: 0,
    loaded: 0,
    loading: 0,
    failed: 0
  };
  _.each(items, function(item) {
    result.total += 1;
    if (item.isPublished) {
      result.published += 1;
    } else {
      result.hidden += 1;
    }

    if (_.isObject(item.loadingStatus)) {
      var status = item.loadingStatus;
      if (status.loaded) {
        result.loaded += 1;
      } else if (status.failed) {
        result.failed += 1;
      } else {
        result.loading += 1;
      }
    } else {
      result.loaded += 1;
    }
  });
  return result;
}

function process(items, filters) {
  // required for proper metrics calculation
  var publishing = filterByPublishingStatus(items, filters.publishingStatus);
  var loading = filterByLoadingStatus(items, filters.loadingStatus);

  // intersection
  items = filterByLoadingStatus(publishing, filters.loadingStatus);

  var metrics = _.extend(getMetrics(items), {
    publishingStatus: _.pick(getMetrics(loading),
      ['total', 'published', 'hidden']),
    loadingStatus: _.pick(getMetrics(publishing),
      ['total', 'loaded', 'loading', 'failed'])
  });

  return {
    items: items,
    metrics: metrics
  };
}

function factory(items, filters) {
  var result = null;

  return {
    getItems: function() {
      result = result || process(items, filters);
      return result.items;
    },
    getMetrics: function() {
      result = result || process(items, filters);
      return result.metrics;
    }
  };
}

module.exports = factory;
