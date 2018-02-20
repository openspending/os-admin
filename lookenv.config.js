module.exports = {
  // Required settings
  OS_BASE_URL: {required: true},

  // Optional settings
  OS_SNIPPETS_GA: {required: false},
  OS_SNIPPETS_RAVEN: {required: false},

  // Each service will use OS_BASE_URL unless overridden by these:
  OS_CONDUCTOR_URL: {required: false},
  OS_SEARCH_URL: {required: false},
  OS_VIEWER_URL: {required: false},
  OS_EXPLORER_URL: {required: false},
  OS_PACKAGER_URL: {required: false}
};
