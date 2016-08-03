'use strict';

// jscs:disable
module.exports = [
  {
    id: '583b10ad15f2e7f078afd3431c2c09ea:test2',
    model: {
      dimensions: {
        date_2: {
          attributes: {
            dt_fscl_yr: {
              column: 'Godina',
              datatype: 'integer',
              label: '\u0413\u043e\u0434\u0438\u043d\u0430',
              orig_attribute: 'dt_fscl_yr'
            }
          },
          key_attribute: 'dt_fscl_yr',
          label: '\u0413\u043e\u0434\u0438\u043d\u0430',
          orig_dimension: 'date'
        }
      },
      fact_table: 'fdp__583b10ad15f2e7f078afd3431c2c__test2',
      hierarchies: {
        date: {
          label: 'Date',
          levels: [
            'date_2'
          ]
        }
      },
      measures: {
        vl: {
          column: 'Iznos',
          currency: 'USD',
          label: '\u0418\u0437\u043d\u043e\u0441',
          orig_measure: 'vl'
        }
      }
    },
    origin_url: 'http://s3.amazonaws.com/datastore.openspending.org/' +
      '583b10ad15f2e7f078afd3431c2c09ea/test2/datapackage.json',
    package: {
      author: 'Levko Kravets <levko.ne@not.shown>',
      model: {
        dimensions: {
          date: {
            attributes: {
              dt_fscl_yr: {
                source: '\u0413\u043e\u0434\u0438\u043d\u0430',
                title: '\u0413\u043e\u0434\u0438\u043d\u0430'
              }
            },
            dimensionType: 'datetime',
            primaryKey: [
              'dt_fscl_yr'
            ]
          }
        },
        measures: {
          vl: {
            currency: 'USD',
            source: '\u0418\u0437\u043d\u043e\u0441',
            title: '\u0418\u0437\u043d\u043e\u0441'
          }
        }
      },
      name: 'test2',
      owner: '583b10ad15f2e7f078afd3431c2c09ea',
      private: false,
      resources: [
        {
          bytes: 75202,
          dialect: {
            csvddfVersion: 1,
            delimiter: ',',
            lineTerminator: '\r\n'
          },
          encoding: 'utf-8',
          format: 'csv',
          mediatype: 'text/csv',
          name: 'test',
          path: 'test.csv',
          schema: {
            fields: [
              {
                conceptType: 'date',
                format: 'default',
                name: '\u0413\u043e\u0434\u0438\u043d\u0430',
                osType: 'date:fiscal-year',
                slug: 'dt_fscl_yr',
                title: '\u0413\u043e\u0434\u0438\u043d\u0430',
                type: 'integer'
              },
              {
                conceptType: 'value',
                decimalChar: '.',
                format: 'default',
                groupChar: ',',
                name: '\u0418\u0437\u043d\u043e\u0441',
                osType: 'value',
                slug: 'vl',
                title: '\u0418\u0437\u043d\u043e\u0441',
                type: 'number'
              }
            ],
            primaryKey: [
              '\u0413\u043e\u0434\u0438\u043d\u0430'
            ]
          }
        }
      ],
      title: 'test2'
    }
  },
  {
    id: '583b10ad15f2e7f078afd3431c2c09ea:test',
    model: {
      dimensions: {
        date_2: {
          attributes: {
            year: {
              column: 'year',
              datatype: 'integer',
              label: 'year',
              orig_attribute: 'year'
            }
          },
          key_attribute: 'year',
          label: 'year',
          orig_dimension: 'date'
        }
      },
      fact_table: 'fdp__583b10ad15f2e7f078afd3431c2c__test',
      hierarchies: {
        date: {
          label: 'Date',
          levels: [
            'date_2'
          ]
        }
      },
      measures: {
        adjusted: {
          column: 'adjusted',
          currency: 'USD',
          label: 'adjusted',
          orig_measure: 'adjusted'
        }
      }
    },
    origin_url: 'http://s3.amazonaws.com/datastore.openspending.org/' +
      '583b10ad15f2e7f078afd3431c2c09ea/test/datapackage.json',
    package: {
      author: 'Levko Kravets <levko.ne@not.shown>',
      model: {
        dimensions: {
          date: {
            attributes: {
              year: {
                source: 'year',
                title: 'year'
              }
            },
            dimensionType: 'datetime',
            primaryKey: [
              'year'
            ]
          }
        },
        measures: {
          adjusted: {
            currency: 'USD',
            source: 'adjusted',
            title: 'adjusted'
          }
        }
      },
      name: 'test',
      owner: '583b10ad15f2e7f078afd3431c2c09ea',
      private: false,
      resources: [
        {
          bytes: 626744786,
          dialect: {
            csvddfVersion: 1,
            delimiter: ',',
            lineTerminator: '\n'
          },
          encoding: 'utf-8',
          format: 'csv',
          mediatype: 'text/csv',
          name: 'boost-moldova-all',
          path: 'boost-moldova-all.csv',
          schema: {
            fields: [
              {
                conceptType: 'date',
                format: 'default',
                name: 'year',
                osType: 'date:fiscal-year',
                slug: 'year',
                title: 'year',
                type: 'integer'
              },
              {
                conceptType: 'value',
                decimalChar: '.',
                format: 'default',
                groupChar: ',',
                name: 'adjusted',
                osType: 'value',
                slug: 'adjusted',
                title: 'adjusted',
                type: 'number'
              }
            ],
            primaryKey: [
              'year'
            ]
          }
        }
      ],
      title: 'test'
    }
  }
];
// jscs:enable
