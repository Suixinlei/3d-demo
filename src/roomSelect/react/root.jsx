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
  color: #fff;
  text-align: center;
`;

const RowButton = styled.div`
  height: 32px;
  line-height: 32px;
  margin: 8px;
  background: #2889ec;
  color: #fff;
  text-align: center;
  cursor: pointer;
  
  :hover {
    background: #2460da;
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
      name: null,
    };
  }

  componentDidMount() {
    window.changeDisplay = (name) => {
      this.setState({
        name,
      });
    };
  }

  closeDisplay = () => {
    this.setState({
      name: null,
    });
  };

  jumpHref = (level) => {
    window.location.href = `/room?name=${parsedQuery.name}&idc=${this.state.name}&level=${level}`;
  };

  render() {
    const { name } = this.state;
    return (
      <PageContainer>
        <CabinetTitle>{parsedQuery.name}</CabinetTitle>
        {
          name &&
          <div>
            <CabinetTitle>{name}</CabinetTitle>
            <RowButton onClick={() => { this.jumpHref(1); }}>1层</RowButton>
            <RowButton onClick={() => { this.jumpHref(2); }}>2层</RowButton>
            <RowButton onClick={this.closeDisplay}>关闭</RowButton>
          </div>
        }
      </PageContainer>
    )
  }
}

export default Root;
