import React from 'react';
import PropTypes from 'prop-types';
import { useCubeQuery } from '@cubejs-client/react';
import { Spin, Row, Col, Statistic, Table, Divider, Modal, Button } from 'antd';
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
import { sql } from '@cubejs-client/core';
import JSONPretty from 'react-json-pretty';
import styled from 'styled-components';
import {useState, useEffect} from 'react';
import sqlFormatter from "sql-formatter";

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
  line: ({ resultSet, pivotConfig }) => (
    <Table
      pagination={true}
      columns={resultSet.tableColumns(pivotConfig)}
      dataSource={resultSet.tablePivot(pivotConfig)}
    />
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
const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map((key) => ({
    [key]: React.memo(TypeToChartComponent[key]),
  }))
  .reduce((a, b) => ({ ...a, ...b }));

const renderChart = (Component) => ({ resultSet, error, pivotConfig }) =>
  (resultSet && (
    <Component resultSet={resultSet} pivotConfig={pivotConfig} />
  )) ||
  (error && error.toString()) || <Spin />;

const ChartRenderer = ({ vizState, validatedQuery }) => {

  const StyledDividerr = styled(Divider)`
    margin: 0 12px;
    height: 4.5em;
    top: 0.5em;
    background: #ffffff;
`
  const StyledModal = styled(Modal)`
    border: 1px solid black;
    width: 150px;
    height: 150px;
    overflow-y: hidden; //
    overflow-x: hidden;
  `
  const [visible, setVisible] = useState(false);
  const [visiblee, setVisiblee] = useState(false);
  const [cacheVisible, setcacheVisible] = useState(false);
  const showModal = () => {
        setVisible(true);
                    }

  const handleOK = e => {
      console.log(e);
    setVisible(false);
                   }

  const handleCancel = e => {
        console.log(e);
        setVisible(false);
                   };

  const showModall = () => {
         setVisiblee(true)
                         };

  const handleOKK = e => {
          console.log(e);
          setVisiblee(false);
                       }

  const handleCancell = e => {
              console.log(e);
              setVisiblee(false);
                           };

  const showCache = () => {
              setcacheVisible(true)
                          };

   const handleCache = e => {
              console.log(e);
              setcacheVisible(false);
                            }

    const handleCacheQuery = e => {
                console.log(e);
                setcacheVisible(false);
                            };

  const [response, setResponse] = useState({});
  const [responsee, setResponsee] = useState({});
  const [cacheResponse, setcacheResponse] = useState({});
  let ur = encodeURIComponent(JSON.stringify(vizState.query));
  let u = "http://localhost:4000/cubejs-api/v1/sql?query=" + ur;
  let us = "http://localhost:4000/cubejs-api/v1/load?query=" + ur;
  useEffect(() => {
    if(u !=="http://localhost:4000/cubejs-api/v1/sql?query=undefined") {
        fetch(u)
            .then(response => (response.json()))
            .then(data => setResponse(current => data?.sql?.sql[0] || current))
    }},[u]);

  useEffect(() => {
    if(us !=="http://localhost:4000/cubejs-api/v1/load?query=undefined") {
        fetch(us)
            .then(responsee => (responsee.json()))
            .then(data => {

                setResponsee(data['query'])

            })
      }},[us]);

  useEffect(() => {
            if(u !=="http://localhost:4000/cubejs-api/v1/sql?query=undefined") {
                fetch(u)
                    .then(cacheResponse => (cacheResponse.json()))
                    .then(data => setcacheResponse(current => data?.sql?.cacheKeyQueries.queries[0][0] || current))
            }},[u]);

  const { query, chartType, pivotConfig } = vizState;
  const component = TypeToMemoChartComponent[chartType];
  const renderProps = useCubeQuery(query);
  const sqlResponse = sqlFormatter.format(response);
  const cacheQuery = sqlFormatter.format(cacheResponse);
  return <div>
              <Button style={{float: 'right'}} type="primary" onClick={showModal}>
                JSONQuery
              </Button>
              <Modal
                visible={visible}
                onOk={handleOK}
                onCancel={handleCancel}
              >
               <p>
                 <div>
                   <p><JSONPretty id="json-pretty" data={responsee}></JSONPretty></p>
                 </div>
               </p>
              </Modal>
              <Button style={{float: 'right'}} type="primary" onClick={showModall}>
                SQLQuery
              </Button>
              <Modal
                visible={visiblee}
                onOk={handleOKK}
                onCancel={handleCancell}
              >
              <p>
                  <p><JSONPretty id="json-pretty" data={sqlResponse}></JSONPretty></p>
              </p>
              </Modal>
              <Button style={{float: 'right'}} type="primary" onClick={showCache}>
                CacheQuery
              </Button>
              <Modal
                visible={cacheVisible}
                onOk={handleCache}
                onCancel={handleCacheQuery}
                width={580}
              >
              <p>
                  <p><JSONPretty id="json-pretty" data={cacheQuery}></JSONPretty></p>
              </p>
              </Modal>
              <StyledDividerr type="vertical"/>
              {renderChart(component)({ ...renderProps, pivotConfig })}
          </div>;
};

ChartRenderer.propTypes = {
  vizState: PropTypes.object,
  cubejsApi: PropTypes.object,
};
ChartRenderer.defaultProps = {
  vizState: {},
  cubejsApi: null,
};
export default ChartRenderer;
