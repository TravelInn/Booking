import React from 'react';
import ReactDOM from 'react-dom';
import ReservationRow from './ReservationRow.jsx';
import styled from 'styled-components';

const StyledTable = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
`;

const StyledBody = styled.tbody`
    background-color: rgb(255, 255, 255);
`;

const Td = styled.td`
    border: 1px solid #C4C4C4;
    white-space:nowrap;
    padding:.5rem;
`;

const Th = styled.th`
    border: 1px solid #C4C4C4;
    white-space:nowrap;
    padding:.5rem;
`;

const Tr = styled.tr`
    font-size: 12px;
    color: rgb(105, 105, 105);
    vertical-align: bottom;
`;

const DormName = styled.th`
    border: 1px solid #C4C4C4;
    white-space:nowrap;
    padding:.5rem;
    text-align: left;
    width: 100%;   
`;

const NormalHeader = styled.th`
    border: 1px solid #C4C4C4;
    white-space:nowrap;
    padding:.5rem;
    min-width: 100px;
`;

const LargeHeader = styled.th`
    border: 1px solid #C4C4C4;
    white-space:nowrap;
    padding:.5rem;
    min-width: 150px;
`

const H4 = styled.h4`
    color: black;
    font-size: 16px;
    margin:0px;
`;


class Reservations extends React.Component {
    constructor(props) {
        super(props);
    }

    
    render() {
        return (
            <div>
                <StyledTable>
                    <thead>
                        <Tr>
                            <DormName><H4>Dorm Beds</H4>
                                <span>Prices are per room</span>
                            </DormName>
                            <NormalHeader>Average price per night</NormalHeader>
                            <LargeHeader>Rooms</LargeHeader>
                        </Tr>
                    </thead>
                    <StyledBody>
                        {this.props.rooms.map((room, index) => {
                            return <ReservationRow key={index} room={room.room} index={index} set={this.props.set}/>
                        })}
                    </StyledBody>
                </StyledTable>
            </div>
        )
    }
}

export default Reservations;