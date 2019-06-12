import React from 'react';
import styled from 'styled-components';
import queryString from 'query-string';

import { Wcontainer, Wline } from '@alife/aisc-widgets';

const parsedQuery = queryString.parse(location.search);

const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 8px dashed #2889EC;
`;

const CabinetTitle = styled.div`
  height: 60px;
  line-height: 60px;
  font-size: 24px;
  color: #333;
  text-align: center;
`;

const ServerRackDetail = styled.div`
  
`;

const RoomDetail = styled.div`
  
`;

const RowButton = styled.div`
  height: 32px;
  line-height: 32px;
  margin: 8px;
  background: #2889ec;
  color: #fff;
  text-align: center;
  cursor: pointer;
`;

const StatusRow = styled.div`
  margin: 20px;
  > span {
    color: #87d068;
  }
`;

let options = {
  padding: [40, 5, 24, 44],
  legend: false,
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
};

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayId: null,
      displayAir: null,
      displayData: [],

      hotMapVisible: false,
    };
  }

  openHotMap = () => {
    this.setState({
      hotMapVisible: true,
    });
    window.createCpuHotMap();
  };

  closeHotMap = () => {
    this.setState({
      hotMapVisible: false,
    });
    window.closeCpuHotMap();
  };

  componentDidMount() {
    fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/93855').then(res => res.json()).then((data) => {
      this.setState({
        displayData: data,
      });
    });
    window.changeDisplay = (id) => {
      fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/93855').then(res => res.json()).then((data) => {
        this.setState({
          displayId: id,
          displayAir: null,
          displayData: data,
        });
      })
    };
    window.displayAir = (id) => {
      fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/93855').then(res => res.json()).then((data) => {
        this.setState({
          displayId: null,
          displayAir: id,
          displayData: data,
        });
      })
    };

    window.closeDisplay = () => {
      this.setState({
        displayId: null,
        displayAir: null,
      });
    }
  }

  render() {
    const { displayId, displayAir, hotMapVisible } = this.state;
    return (
      <PageContainer>
        <CabinetTitle>{parsedQuery.name}</CabinetTitle>
        {
          hotMapVisible ?
            <RowButton onClick={this.closeHotMap}>关闭CPU热力图</RowButton> :
            <RowButton onClick={this.openHotMap}>CPU热力图</RowButton>
        }
        {
          (displayId || displayAir) ?
            displayAir ?
              <ServerRackDetail>
                <Wcontainer title={`${displayAir} 温度趋势`} height={298}>
                  <Wline config={options} data={this.state.displayData[1]}/>
                </Wcontainer>
              </ServerRackDetail> :
              <ServerRackDetail>
                <Wcontainer title={`${displayId} CPU趋势`} height={298}>
                  <Wline config={options} data={this.state.displayData[0]}/>
                </Wcontainer>
                <Wcontainer title={`${displayId} 温度趋势`} height={298}>
                  <Wline config={options} data={this.state.displayData[1]}/>
                </Wcontainer>
                <Wcontainer title={`${displayId} 湿度趋势`} height={298}>
                  <Wline config={options} data={this.state.displayData[1]}/>
                </Wcontainer>
              </ServerRackDetail>
            :
            <RoomDetail>
              <StatusRow>
                市电状态: <span>正常</span>
              </StatusRow>
              <StatusRow>
                告警数: <span>0</span>
              </StatusRow>
              <StatusRow>
                机柜数: <span>130</span>
              </StatusRow>
              <StatusRow>
                机器数: <span>3474</span>
              </StatusRow>
              <StatusRow>
                网络设备数: <span>3500</span>
              </StatusRow>
              <StatusRow>
                平均温度: <span>24摄氏度</span>
              </StatusRow>
              <StatusRow>
                平均湿度: <span>50%</span>
              </StatusRow>
              <Wcontainer title={`${parsedQuery.name} 机房温度`} height={298}>
                <Wline config={options} data={this.state.displayData[0]}/>
              </Wcontainer>
              <Wcontainer title={`${parsedQuery.name} 机房湿度`} height={298}>
                <Wline config={options} data={this.state.displayData[0]}/>
              </Wcontainer>
            </RoomDetail>
        }
      </PageContainer>
    )
  }
}

export default Root;
