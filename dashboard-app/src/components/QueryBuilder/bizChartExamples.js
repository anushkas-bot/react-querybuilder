import React from 'react';
import Example from './Example';
import SourceRender from 'react-source-render';
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import cubejs from '@cubejs-client/core';
import * as cubejsReact from '@cubejs-client/react';
import * as antd from 'antd';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin, Row, Col, Select } from 'antd';
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import PropTypes from 'prop-types';
import { Statistic, Table, Button } from 'antd';

import * as bizChartLibrary from './bizChart';
import * as chartjsLibrary from './chartjs';

const libraryToTemplate = {
  bizcharts: bizChartLibrary,
  chartjs: chartjsLibrary
};

const CartesianChart = ({ resultSet, children, ChartComponent }) => (
  <ResponsiveContainer width="100%" height={350}>
    <ChartComponent data={resultSet.chartPivot()}>
      <XAxis dataKey="x" />
      <YAxis />
      <CartesianGrid />
      {children}
      <Legend />
      <Tooltip />
    </ChartComponent>
  </ResponsiveContainer>
);

const colors = ['#FF6492', '#141446', '#7A77FF'];

const stackedChartData = (resultSet) => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(xValues, ', '),
        color: resultSet.axisValuesString(yValues, ', '),
        measure: m && Number.parseFloat(m),
      }))
    )
    .reduce((a, b) => a.concat(b), []);
  return data;
};

const TypeToChartComponent = {
  line: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={LineChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Line
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  bar: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={BarChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Bar
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  area: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={AreaChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Area
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  pie: ({ resultSet }) => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={resultSet.chartPivot()}
          nameKey="x"
          dataKey={resultSet.seriesNames()[0].key}
          fill="#8884d8"
        >
          {resultSet.chartPivot().map((e, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ),
  number: ({ resultSet }) => (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        height: '100%',
      }}
    >
      <Col>
        {resultSet.seriesNames().map((s) => (
          <Statistic value={resultSet.totalRow()[s.key]} />
        ))}
      </Col>
    </Row>
  ),
  table: ({ resultSet, pivotConfig }) => (
    <Table
      pagination={true}
      columns={resultSet.tableColumns(pivotConfig)}
      dataSource={resultSet.tablePivot(pivotConfig)}
    />
  ),
};

class Chart extends React.Component {
  render() {
    const ChartComponent = TypeToChartComponent[this.props.type];
    return (
      <ChartComponent
        {...this.props}
        ref={ref => this.chartInstance = ref && ref.chartInstance}
      />
    )
  }
}

const babelConfig = {
  presets: [
    presetEnv,
    presetReact
  ]
};

const sourceCodeTemplate = (chartLibrary, chartType, query) => (
  `import React from 'react';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin } from 'antd';

const query =
${typeof query === 'object' ? JSON.stringify(query, null, 2) : query};
const HACKER_NEWS_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpIjozODU5NH0.5wEbQo-VG2DEjR2nBpRpoJeIcE_oJqnrm78yUo9lasw';
const Example = <QueryRenderer
  query={query}
  cubejsApi={cubejs(HACKER_NEWS_API_KEY)}
  render={({ resultSet }) => (
    resultSet && renderChart(resultSet) || (<Spin />)
  )}
/>;
export default Example;
`);

const basicFilterCodeTemplate = (chartLibrary, chartType, query) => (
  `import React from 'react';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin, Row, Col, Select } from 'antd';
const Option = Select.Option;
${libraryToTemplate[chartLibrary].sourceCodeTemplate(chartType, query)}
const query =
${typeof query === 'object' ? JSON.stringify(query, null, 2) : query};
const HACKER_NEWS_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpIjozODU5NH0.5wEbQo-VG2DEjR2nBpRpoJeIcE_oJqnrm78yUo9lasw';
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = { category: 'Other' };
  }

  handleChange(value) {
    this.setState({ category: value })
  }

  render() {
    return <div>
      <Row style={{ marginBottom: 12 }}>
        <Col>
          <Select value={this.state.category} style={{ width: 120 }} onChange={this.handleChange.bind(this)}>
            <Option value="Ask">Ask</Option>
            <Option value="Show">Show</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <QueryRenderer
            query={{
              ...query,
              filters: [
                ...query.filters,
                {
                  dimension: 'Stories.category',
                  operator: 'equals',
                  values: [this.state.category]
                }
              ]
            }}
            cubejsApi={cubejs(HACKER_NEWS_API_KEY)}
            render={ ({ resultSet }) => (
              resultSet && renderChart(resultSet) || (<Spin />)
            )}
          />
        </Col>
      </Row>
    </div>
  }
};
`);

const datePickerCodeTemplate = (chartLibrary, chartType, query) => (
  `import React from 'react';
import cubejs from '@cubejs-client/core';
import { QueryRenderer } from '@cubejs-client/react';
import { Spin, Row, Col, DatePicker } from 'antd';
${libraryToTemplate[chartLibrary].sourceCodeTemplate(chartType, query)}
const HACKER_NEWS_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpIjozODU5NH0.5wEbQo-VG2DEjR2nBpRpoJeIcE_oJqnrm78yUo9lasw';
export default class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = { range: [
      moment('2014-01-01'), moment('2014-12-31')
    ]};
  }

  render() {
    const range = this.state.range;
    return <div>
      <Row style={{ marginBottom: 12 }}>
        <Col>
          <DatePicker.RangePicker
            onChange={(range) => this.setState({ range })}
            value={this.state.range}
            style={{ marginBottom: 12 }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <QueryRenderer
            cubejsApi={cubejs(HACKER_NEWS_API_KEY)}
            query={{
              measures: ['Stories.count'],
              dimensions: ['Stories.time.month'],
              filters: range && range.length && [{
                dimension: 'Stories.time',
                operator: 'inDateRange',
                values: range.map(d => d.format('YYYY-MM-DD'))
              }] || []
            }}
            render={ ({ resultSet }) => (
              resultSet && renderChart(resultSet) || (<Spin />)
            )}
          />
        </Col>
      </Row>
    </div>;
  }
}
`);

const renderExample = ({ chartType, query, sourceCodeFn, title }) => {
  sourceCodeFn = sourceCodeFn || sourceCodeTemplate;
  return ({ chartLibrary }) => {
    const chart = (<SourceRender
      babelConfig={babelConfig}
      onError={error => console.log(error)}
      onSuccess={(error, { markup }) => console.log('HTML', markup)}
      resolver={importName => ({
        '@cubejs-client/core': cubejs,
        '@cubejs-client/react': cubejsReact,
        antd,
        react: React,
        ...libraryToTemplate[chartLibrary].imports
      })[importName]}
      source={sourceCodeFn(chartLibrary, chartType, query)}
    />);
    return (<Example
      title={title}
      query={query}
      codeExample={sourceCodeFn(chartLibrary, chartType, query)}
      render={() => chart}
    />);
  }
};

const chartsExamples = {
  line: {
    group: 'basic',
    render: renderExample({
      title: '',
      chartType: 'line',
      query: {
        measures: ['Stories.count'],
        dimensions: ['Stories.time.month'],
        filters: [
          {
            dimension: `Stories.time`,
            operator: `beforeDate`,
            values: [`2010-01-01`]
          }
        ]
      }
    })
  }
};

export default chartsExamples;
