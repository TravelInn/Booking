import React from 'react';
import ReactDom from 'react-dom';
import FindBar from './components/FindBar.jsx';
import Reservations from './components/Reservations.jsx';
import ReservationConfirm from './components/ReservationConfirm.jsx';
import { CSSTransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import helpers from './components/helpers';

const Container = styled.div.attrs({
    className: 'container'
})`

margin:auto;
max-width: 1110px;
z-index: -1;
`

const H2= styled.h2`
    margin-top: 0;
`

const Styles=styled.div`
    font-family: Helvetica;
    width: 100%; 
    background-color: rgb(235, 235, 235); 
    padding-top: 30px;
    padding-bottom: 30px;
`

export default class Booking extends React.Component {
    constructor(props) {
        super(props);
        let response = this.props.data || {"startDate":0,"endDate":2,"bookings":[{"id":1,"price":17,"beds":2,"startdate":2,"enddate":4}],"rooms":[{"id":1,"hostel_id":1,"price":17,"beds":2},{"id":2,"hostel_id":1,"price":9,"beds":4}]};
        response = helpers.filterBookings([response.startDate, response.endDate], response.bookings, response.rooms);
        const clone = JSON.parse(JSON.stringify(response));
        this.state = {
            unfiltered: clone,
            lastUnfiltered: {},
            hotelRooms: {rooms: response.rooms},
            startDate: '2018-06-19',
            endDate: '2018-06-21',
            startPoint: 0,
            endPoint: 0,
            currentRoom: {},
            numberOfBeds: 0,
            averagePrice: 0,
            selectedRooms: {},
            total: 0,
            startCal: false,
            endCal: false,
        }
        this.startHolder = this.props.startHolder || '2018-06-19';
        this.endHolder = this.props.endHolder || '2018-06-21';
        this.setCurrentRoom = this.setCurrentRoom.bind(this);
        this.updateTotal = this.updateTotal.bind(this);
        this.turnOff = this.turnOff.bind(this);
        this.toggleCalendars = this.toggleCalendars.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.submitDates = this.submitDates.bind(this);
    }

    componentDidMount() {
        if (window && window.client) {
            this.initializeRoom();
        }
    }
    
    initializeRoom() {
        if (window.location.pathname === '/') {
            fetch(`/api/hostels/1/reservations?start=${this.startHolder}&end=${this.endHolder}`)
            .then(response => response.json())
            .then(response => {
                response = helpers.filterBookings([response.startDate, response.endDate], response.bookings, response.rooms);
                let clone = JSON.parse(JSON.stringify(response));
                this.setState({unfiltered: clone});
                this.setState({hotelRooms: {rooms: response.rooms}});
             })
        } else {
            let path = window.location.pathname;
            fetch(`/api/hostels${path}reservations?start=${this.startHolder}&end=${this.endHolder}`)
            .then(response => response.json())
            .then(response => {
                response = helpers.filterBookings([response.startDate, response.endDate], response.bookings, response.rooms);
                let clone = JSON.parse(JSON.stringify(response));
                this.setState({unfiltered: clone});
                this.setState({hotelRooms: {rooms: response.rooms}});
            })
        }
    }

    setCurrentRoom(room, beds, avg, index) {
        this.setState({
            currentRoom: room,
            numberOfBeds: beds,
            averagePrice: avg
        })
        let rooms = this.state.selectedRooms;
        rooms[index] = room;
        rooms[index].reservedBeds = beds;
        rooms[index].avg = avg;
        this.setState({
            selectedRooms: rooms,
        })
        this.updateTotal(rooms)
    }

    updateTotal(rooms) {
        let total = 0;
        for (var i in rooms) {
            if (rooms[i].reservedBeds !== "Select") {
                total += rooms[i].reservedBeds * rooms[i].avg * rooms[i].length;
            }
        }
        this.setState({total: total});
    }

    turnOff(event) {
        if (!event.target.className.includes("nullClick")) {
            this.setState({
                startCal: false,
                endCal: false,
            })
        }
    }

    toggleCalendars(event) {
        event.preventDefault();
        if (this.state.startCal && event.target.id !== startCal) {
            this.setState({ startCal: false })
        }
        if (this.state.endCal && event.target.id !== endCal) {
            this.setState({ endCal: false })
        }
        this.setState({[event.target.id]: !this.state[event.target.id]})
    }

    setStartDate(year, month, day) {
        this.startHolder = year + '-' + month + '-' + day;
    }

    setEndDate(year, month, day) {
        this.endHolder =  year + '-' + month + '-' + day;
    }

    submitDates() {
        if(this.startHolder !== 0 && this.endHolder !== 0 && this.startHolder < this.endHolder) {
            this.setState({
                startDate: this.startHolder,
                endDate: this.endHolder,
                selectedRooms: [],
                total: 0,
            })
            this.initializeRoom();
        }
    }

    renderReservations(){
        if (1) {
            return <Reservations rooms={this.state.hotelRooms.rooms} set={this.setCurrentRoom}/>
        }
    }

    renderReservationsConfirm(){
        if (1) {
            return <ReservationConfirm 
            room={this.state.currentRoom}
            beds={this.state.numberOfBeds}
            average={this.state.averagePrice}
            selected={this.state.selectedRooms}
            total={this.state.total}/>
        }
    }


    render(){
        return (
            <Styles onClick={this.turnOff}>
                <Container>
                    <H2>Check Availability</H2>
                    <FindBar startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        startCal={this.state.startCal}
                        endCal={this.state.endCal}
                        toggler={this.toggleCalendars}
                        setStartDate={this.setStartDate}
                        setEndDate={this.setEndDate}
                        submitDates={this.submitDates}
                        startHolder={this.startHolder}
                        />
                    {this.renderReservations()}
                    {this.renderReservationsConfirm()}
                </Container>
            </Styles>
        )
    }
}

window.Booking = Booking;

// ReactDom.render(<Booking/>, document.getElementById('booking'));
