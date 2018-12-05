import React from 'react';
import ReactDOM from 'react-dom';
import { Wcontainer, Wline } from '@alife/aisc-widgets';
import '@alife/aisc-widgets/build/index.css';
import styled from 'styled-components';

let data = [
  {
    "name":"机房1",
    "data":[[1483372800000,1892],[1483459200000,7292],[1483545600000,5714],[1483632000000,5354],[1483718400000,2014],[1483804800000,22],[1483891200000,11023],[1483977600000,5218],[1484064000000,8759],[1484150400000,9981],[1484236800000,4533],[1484323200000,11398],[1484409600000,1064],[1484496000000,6494]]
  },{
    "name":"机房2",
    "data":[[1483372800000,11751],[1483459200000,4078],[1483545600000,2175],[1483632000000,12048],[1483718400000,1748],[1483804800000,10494],[1483891200000,9597],[1483977600000,4788],[1484064000000,2085],[1484150400000,492],[1484236800000,2965],[1484323200000,4246],[1484409600000,2160],[1484496000000,11877]]
  }
];

let options = {
  padding: [40, 5, 24, 44],
  xAxis: {
    type: 'time',
    mask: 'YYYY-MM-DD'
  },
};

const LeftTopContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 50px;
  width: 600px;
`;

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: null,
      displayData: [],
    };
  }


  componentDidMount() {
    window.changeDisplay = (id) => {
      this.setState({
        display: id,
      });
      fetch('http://dip.alibaba-inc.com/api/v2/services/schema/mock/70846').then(res => res.json()).then((data) => {
        this.setState({
          displayData: data,
        });
      })
    }
  }

  render() {
    return (
      <div>
        <LeftTopContainer>
          {
            this.state.display &&
            <Wcontainer className="demos">
              <Wline height="300" config={options} data={this.state.displayData}/>
            </Wcontainer>
          }
        </LeftTopContainer>
      </div>
    );
  }
}

const element = document.getElementById('reactContainer');
ReactDOM.render(
  <Root />,
  element
);
