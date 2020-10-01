import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import { Row, Col, Divider, Card, Popover, Button, Layout, Menu, Radio, Spin, Select } from 'antd';
import { SortAscendingOutlined, BorderInnerOutlined } from '@ant-design/icons';
import { QueryBuilder } from '@cubejs-client/react';
import ChartRenderer from '../ChartRenderer';
import MemberGroup from './MemberGroup';
import FilterGroup from './FilterGroup';
import styled from 'styled-components';
import TimeGroup from './TimeGroup';
import SelectChartType from './SelectChartType';
import OrderGroup from './Order/OrderGroup';
import Pivot from './Pivot/Pivot';
import { useState } from 'react';
import 'antd/dist/antd.css';
import Icon from '@ant-design/icons';

//import App from './App';

const ControlsRow = styled(Row)`
  background: #ffffff;
  margin-bottom: 12px;
  padding: 18px 28px 10px 28px;
`

const StyledDivider = styled(Divider)`
  margin: 0 12px;
  height: 4.5em;
  top: 0.5em;
  background: #F4F5F6;
`

const HorizontalDivider = styled(Divider)`
  padding: 0;
  margin: 0;
  background: #F4F5F6;
`

const ChartCard = styled(Card)`
  border-radius: 4px;
  border: none;
`

const ChartRow = styled(Row)`
  padding-left: 28px;
  padding-right: 28px;
`

export default function ExploreQueryBuilder({
  vizState,
  cubejsApi,
  setVizState,
  chartExtra,
})
 {

  return (
    <QueryBuilder
    vizState={vizState}
    setVizState={setVizState}
    cubejsApi={cubejsApi}
    wrapWithQueryRenderer={false}
    render={({
      measures,
      availableMeasures,
      updateMeasures,
      dimensions,
      availableDimensions,
      updateDimensions,
      segments,
      availableSegments,
      updateSegments,
      filters,
      updateFilters,
      timeDimensions,
      availableTimeDimensions,
      updateTimeDimensions,
      isQueryPresent,
      chartType,
      updateChartType,
      validatedQuery,
      cubejsApi,
      resultSet,
    }) => [
      <ControlsRow type="flex" justify="space-around" align="top" key="1">
        <Col span={24}>
          <Row type="flex" align="top" style={{ paddingBottom: 23}}>
            <MemberGroup
              title="Aggregate"
              members={measures}
              availableMembers={availableMeasures}
              addMemberName="Aggregate"
              updateMethods={updateMeasures}
            />
            <StyledDivider type="vertical" />
            <MemberGroup
              title="Group"
              members={dimensions}
              availableMembers={availableDimensions}
              addMemberName="Group"
              updateMethods={updateDimensions}
            />
            <StyledDivider type="vertical"/>
            <MemberGroup
              title="Segment"
              members={segments}
              availableMembers={availableSegments}
              addMemberName="Segment"
              updateMethods={updateSegments}
            />
            <StyledDivider type="vertical"/>
            <TimeGroup
              title="Time"
              members={timeDimensions}
              availableMembers={availableTimeDimensions}
              addMemberName="Time"
              updateMethods={updateTimeDimensions}
            />
          </Row>
          {!!isQueryPresent && ([
            <HorizontalDivider />,
            <Row type="flex" justify="space-around" align="top" gutter={24} style={{ marginTop: 10 }}>
              <Col span={24}>
                <FilterGroup
                  members={filters}
                  availableMembers={availableDimensions.concat(availableMeasures)}
                  addMemberName="Filter"
                  updateMethods={updateFilters}
                />
              </Col>
            </Row>
          ])}
        </Col>
      </ControlsRow>,
      <ChartRow type="flex" justify="space-around" align="top" gutter={24} key="2">
       <Col span={24}>
          {isQueryPresent ? ([
            <Row style={{ marginTop: 15, marginBottom: 25 }}>
              <SelectChartType
                chartType={chartType}
                updateChartType={updateChartType}
              />
            </Row>,
            <ChartCard style={{ minHeight: 420 }}>
              <ChartRenderer
                vizState={{ query: validatedQuery, chartType }}
                cubejsApi={cubejsApi}
              />
            </ChartCard>,
            /*<ChartCard style={{ minHeight: 420 }}>
                  { renderGroup(activeChart) }
            </ChartCard>,*/
            <ChartCard style={{ minHeight: 420 }}>
                <pre>
                  <code>{JSON.stringify(validatedQuery, null, 4)}</code>
                </pre>
            </ChartCard>
          ]) : (
            <h2
              style={{
                textAlign: "center"
              }}
            >
            </h2>
          )}
        </Col>
      </ChartRow>
    ]}
  />
  );
}
