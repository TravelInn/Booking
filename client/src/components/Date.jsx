import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Basic = styled.li`
    text-align: center;
    width: 13.69%;
    height: 35px;
    cursor: pointer;
`

const FlexDate = Basic.extend`
    &:hover {
        background-color: pink;
    }
    `
const PinkDate = Basic.extend`
    background-color: pink;
`

const Unavailable = Basic.extend`
    background-color: gray;
`

const Text = styled.p`
    margin-top: 10px;
`



class CDate extends React.Component {
    constructor(props) {
        super(props);
        this.clickHandler = this.clickHandler.bind(this);
        let unavailable = false;
    }
    
    componentDidMount() {
        let test = new Date(this.props.year, this.props.month, this.props.day)
        let test2 = '2018-08-16T00:00:00.000Z'
        let test3= test2.split('T')[0]
        let testfin = this.parseDate(test3)
    }

    
    parseDate(input) {
        let string = input.split('T')[0];
        let date = string.split('-')
        let year = date[0];
        let month = date[1];
        let day = date[2];
        return new Date(year, month, day);
    }

    clickHandler(event) {
        if(!this.props.dateSelected && !this.unavailable) {
            if (this.props.id == 'Calendar') this.props.setStartDate(this.props.year, this.props.month, this.props.day)
            if (this.props.id == 'Calendar2') this.props.setEndDate(this.props.year, this.props.month, this.props.day)
            this.props.clickDate(this.props.day);
        }
        this.props.oneClick();
    }



    render() {
        let earliestDate;
        let lastFetchedDate = this.parseDate('2018-08-16T00:00:00.000Z');
        if (this.props.startHolder) {
            earliestDate = new Date(...this.props.startHolder.split('-'))
        }
        let currentDate = new Date(this.props.year, this.props.month, this.props.day);
        if (currentDate > lastFetchedDate) {
            this.unavailable = true;
        } else {this.unavailable = false;}
        if (earliestDate) {
            if (currentDate <= earliestDate || currentDate > lastFetchedDate) this.unavailable = true
            else this.unavailable = false;
        }
        if (!this.props.day) {
            return (
                <FlexDate className="nullClick"><Text> </Text></FlexDate>
            )
        }
        if (this.unavailable) {
            return (
                <Unavailable className="nullClick" onClick={this.clickHandler}>
                    <Text className="nullClick">{this.props.day}</Text>
                </Unavailable>
            )
        }
        if (this.props.day === this.props.clickedDate) {
            return (
                <PinkDate className="nullClick" onClick={this.clickHandler}>
                    <Text className="nullClick">{this.props.day}</Text>
                </PinkDate>
            )
        }
            return (
                
                <FlexDate className="nullClick" onClick={this.clickHandler}>
                    <Text className="nullClick">{this.props.day}</Text>
                </FlexDate>
            )
    }
}

export default CDate;