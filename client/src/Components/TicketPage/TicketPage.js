import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Comment from "../Comment/Comment.js";
import TicketTable from "./TicketTable";
import "./TicketPage.css";
import { MarkAsRead } from '../Activity/Activity';
import NewComment from './NewComment';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class TicketPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheTickets: [],
            allOfTheComments: [],
            loggedin: true,
            orderBy: 'time_submitted',
            selected: [],
            theTicket: null,
            newComment: '',
            internal: 'false',
            loggedinTech: {
                "technician_ID": '',
                "firstname": '',
                "lastname": '',
                "active_user": 0,
                "is_admin": 0
            },
            allTechnicians: null,
            filter: 'all',
            technicians: [],
        };

        this.loadTechnician();
        this.loadTickets();
        this.loadAllTechnicians();
        this.loadTickets = this.loadTickets.bind(this);
        this.loadMyTickets = this.loadMyTickets.bind(this);
        this.loadUnassignedTickets = this.loadUnassignedTickets.bind(this);
        this.loadClosedTickets = this.loadClosedTickets.bind(this);
        this.loadAllComments = this.loadAllComments.bind(this);
        this.loadTicket = this.loadTicket.bind(this);
        this.loadTechnician = this.loadTechnician.bind(this);
        this.submitTicketHandler = this.submitTicketHandler.bind(this);
        this.ticketManagement = this.ticketManagement.bind(this);
        this.deleteTicketHandler = this.deleteTicketHandler.bind(this);
        this.acceptTicketHandler = this.acceptTicketHandler.bind(this);
        this.assignTicketHandler = this.assignTicketHandler.bind(this);
        this.filterHandler = this.filterHandler.bind(this);
        this.updateStatus = this.updateStatus.bind(this);
        this.loadAllTechnicians = this.loadAllTechnicians.bind(this);
        this.RenderTicketDetails = this.RenderTicketDetails.bind(this);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.selectedTicket !== null) {
            this.loadTicket(newProps.selectedTicket);
        }
    }

    loadTechnician() {
        if (localStorage.user !== undefined) {
            fetch('/users/getUser/' + localStorage.user, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token
                }
            })
                .then(function (response) {
                    if (response.status === 403) {
                        localStorage.removeItem('token');
                        this.setState({ loggedin: false });
                    } else {
                        return response.json();
                    }
                }.bind(this))
                .then(data => this.setState({
                    loggedinTech: {
                        technician_ID: data.technician_ID,
                        firstname: data.first_name,
                        lastname: data.last_name,
                        active_user: data.active_user,
                        is_admin: data.is_admin
                    }
                }))
                .catch(err => console.log(err))
        }
    }

    loadTickets() {
        if (this.state.filter === 'my_tickets') {
            this.loadMyTickets();
        } else if (this.state.filter === 'unassigned') {
            this.loadUnassignedTickets();
        } else if (this.state.filter === 'closed') {
            this.loadClosedTickets();
        } else {

            fetch('/tickets/open', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token
                }
            })
                .then(function (response) {
                    if (response.status === 403) {
                        localStorage.removeItem('token');
                        this.setState({ loggedin: false });
                    } else {
                        return response.json();
                    }
                }.bind(this))
                .then(data => {
                    data.forEach(item => {
                        var date = new Date(item.time_submitted * 1000);
                        item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                    });
                    this.setState({ allOfTheTickets: data.reverse() })
                })
                .catch(err => console.log(err))
        }
    }

    loadMyTickets() {
        fetch('/tickets/my_tickets/' + this.state.loggedinTech.firstname + ' ' + this.state.loggedinTech.lastname, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => {
                data.forEach(item => {
                    var date = new Date(item.time_submitted * 1000);
                    item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                });
                this.setState({ allOfTheTickets: data.reverse() })
            })
            .catch(err => console.log(err))
    }

    loadUnassignedTickets() {
        fetch('/tickets/unassigned', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => {
                data.forEach(item => {
                    var date = new Date(item.time_submitted * 1000);
                    item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                });
                this.setState({ allOfTheTickets: data.reverse() })
            })
            .catch(err => console.log(err))
    }

    loadClosedTickets() {
        fetch('/tickets/closed', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => {
                data.forEach(item => {
                    var date = new Date(item.time_submitted * 1000);
                    item.time_submitted = (("0" + (date.getMonth() + 1)).slice(-2)) + '/' + (("0" + date.getDate()).slice(-2)) + '/' + date.getFullYear();
                });
                this.setState({ allOfTheTickets: data.reverse() })
            })
            .catch(err => console.log(err))
    }

    loadTicket(num) {
        fetch('/tickets/' + num, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    localStorage.removeItem('token');
                    this.setState({ loggedin: false });
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => this.setState({ theTicket: data }))
            .catch(err => console.log(err));

        this.loadAllComments(num);
        MarkAsRead(num, this.state.loggedinTech.technician_ID);
    }

    loadAllComments(num) {
        this.setState({ activitySelectedTicket: num });
        fetch('/comments/' + num, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.token
            }
        })
            .then(function (response) {
                if (response.status === 403) {
                    this.logout();
                } else {
                    return response.json();
                }
            }.bind(this))
            .then(data => {
                this.setState({ allOfTheComments: data });
            })
            .catch(err => console.log(err))
    }

    submitTicketHandler() {
        this.props.history.push('/SubmitTicket');
    }

    deleteTicketHandler() {
        if (window.confirm("Are you sure you'd like to delete this ticket?")) {
            var this_ticket_id = this.state.theTicket.ticket_ID;
            fetch('/tickets/delete/' + this_ticket_id, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
            })
                .then(response => response.text())
                .then(response => {
                    if (response === "Ticket deleted successfully") {
                        alert("Ticket " + this_ticket_id + " deleted sucessfully");
                        this.setState({ theTicket: null });
                        this.loadTickets();
                    } else {
                        NotificationManager.error('Error Deleting Ticket', '');
                    }
                });
        }
    }

    assignTicketHandler(technician_name) {
        if (technician_name === undefined) {
            return;
        }

        fetch('/tickets/assign/' + this.state.theTicket.ticket_ID + '/' + technician_name, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Ticket assigned successfully") {
                    this.loadTickets();
                    NotificationManager.success('Ticket assigned successfully', '');
                } else {
                    NotificationManager.error('Error Assigning Ticket', '');
                }
            });
    }

    acceptTicketHandler() {
        fetch('/tickets/assign/' + this.state.theTicket.ticket_ID + '/' + this.state.loggedinTech.firstname + ' ' + this.state.loggedinTech.lastname, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Ticket assigned successfully") {
                    this.loadTickets();
                    NotificationManager.success('Accepted ticket sucessfully', '');
                } else {
                    //alert("Error assigning ticket");
                    NotificationManager.error('Error Assigning Ticket', '');
                }
            });
    }

    loadAllTechnicians() {
        fetch('/users/all_technicians', {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ allTechnicians: response })
            });
    }



    filterHandler(value) {
        this.setState({ filter: value }, function () {
            this.loadTickets();
            this.setState({ theTicket: null });
        });
        // run a fetch. make routes with sql queries matching filter.
    }

    updateStatus(status) {
        if (status === "close") {
            fetch('/tickets/close/' + this.state.theTicket.ticket_ID, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
            })
                .then(response => response.text())
                .then(response => {
                    if (response === "Ticket closed successfully") {
                        this.loadTickets();
                        var ticket_ID = this.state.theTicket.ticket_ID
                        this.setState({ theTicket: null });
                        this.loadTicket(ticket_ID);
                    } else {

                    }
                });
            return;
        }
        if (status === "not waiting" || status === "reopen") {
            status = "open";
        }
        fetch('/tickets/update_status/' + this.state.theTicket.ticket_ID + '/' + status, {
            method: 'get',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Ticket status updated successfully") {
                    this.loadTickets();
                    var ticket_ID = this.state.theTicket.ticket_ID
                    this.setState({ theTicket: null });
                    this.loadTicket(ticket_ID);
                } else {
                    //alert("Error updating ticket status");
                    NotificationManager.error('Error Updating Ticket Status', '');
                }
            });
    }

    ticketManagement() {
        return (
            <div className="assignButtons">
                <NotificationContainer />
                {this.state.loggedinTech.is_admin === 1 ? <button
                    className="deleteButton"
                    onClick={this.deleteTicketHandler}>
                    Delete
                    </button>
                    : null}

                {this.state.theTicket.assigned_technician !== this.state.loggedinTech.firstname + ' ' + this.state.loggedinTech.lastname ? <button
                    className="acceptButton"
                    onClick={this.acceptTicketHandler}>
                    Accept </button>
                    : null}

                <select className="selectStatus" onChange={(e) => this.assignTicketHandler(e.target.value)}>
                    {this.state.theTicket.assigned_technician === null ? <option value="" selected="selected" disabled>Assign</option> : null}
                    {this.state.allTechnicians === null
                        ?
                        null
                        :
                        this.state.allTechnicians.map((tech, i) => {
                            var full_name = tech.first_name + " " + tech.last_name;
                            if (this.state.theTicket.assigned_technician === null) {
                                return (
                                    <option
                                        selected={this.state.theTicket.assigned_technician === full_name ? "selected" : ""}
                                        disabled={this.state.theTicket.assigned_technician === full_name ? "disabled" : ""}
                                        key={tech.technician_ID}
                                        value={full_name}>
                                        {full_name}
                                    </option>
                                )
                            } else {
                                return (
                                    <option
                                        selected={this.state.theTicket.assigned_technician === full_name ? "selected" : ""}
                                        disabled={this.state.theTicket.assigned_technician === full_name ? "disabled" : ""}
                                        key={tech.technician_ID}
                                        value={full_name}>
                                        {full_name}
                                    </option>
                                )
                            }
                        })
                    }
                </select>

                {this.state.theTicket.status === "open" || this.state.theTicket.status === "waiting"
                    ?
                    <select onChange={(e) => this.updateStatus(e.target.value)} className="selectStatus">
                        <option value="" selected disabled>{this.state.theTicket.status.charAt(0).toUpperCase() + this.state.theTicket.status.slice(1)}</option>
                        <option value="close">Close</option>
                        {this.state.theTicket.status === "open" ? <option value="waiting">Waiting</option> : <option value="not waiting">Not waiting</option>}
                    </select>
                    :
                    <select onChange={(e) => this.updateStatus(e.target.value)} className="selectStatus">
                        <option value="" selected disabled>{this.state.theTicket.status.charAt(0).toUpperCase() + this.state.theTicket.status.slice(1)}</option>
                        <option value="reopen">Reopen</option>
                    </select>}
            </div>
        );
    }

    RenderTicketDetails() {
        if (this.state.theTicket === null) {
            return <div></div>;
        } else {
            var location = undefined;
            if (this.state.theTicket.location === "canyon") {
                location = "Canyon";
            } else if (this.state.theTicket.location === "hill") {
                location = "Hill";
            } else if (this.state.theTicket.location === "cypress") {
                location = "Cypress";
            } else if (this.state.theTicket.location === "creekview") {
                location = "Creekview";
            } else if (this.state.theTicket.location === "campus_apartments") {
                location = "Campus Apartments";
            } else if (this.state.theTicket.location === "college_creek") {
                location = "College Creek";
            }

            return (
                <div className="ticketDetails">
                    {this.state.theTicket.customer_name + "\n"}
                    {this.state.theTicket.phone_number === null || this.state.theTicket.phone_number === "" ? null : "(" + this.state.theTicket.phone_number.slice(0, 3) + ")" + this.state.theTicket.phone_number.slice(4) + "\n"}
                    {this.state.theTicket.location === "" ? null : location + '\n'}
                    {this.state.theTicket.customer_ID + "\n"}
                </div>
            );
        }
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="ticketPage">
                    <Paper>
                        <TicketTable
                            allOfTheTickets={this.state.allOfTheTickets}
                            loadTicket={this.loadTicket}
                            filterHandler={this.filterHandler}
                            submitTicketHandler={this.submitTicketHandler}
                            activitySelectedTicket={this.props.selectedTicket}
                            changeSelectedTicket={this.props.changeSelectedTicket}
                        />
                    </Paper>
                    <div className="marginTop">
                        {this.state.theTicket === null ? null :
                            <div className="details">
                                <this.ticketManagement />
                                {this.state.theTicket === null ? null : <h3 className="ticketSubject">{this.state.theTicket.subject}</h3>}
                                {this.state.theTicket === null ? null : <p className="ticketDescription">{this.state.theTicket.description}</p>}
                                <this.RenderTicketDetails />
                            </div>
                        }
                    </div>
                    <div className="comment-area">
                        {this.state.theTicket === null ? null :
                            <div className="commentUI">
                                <NewComment
                                    theTicket={this.state.theTicket}
                                    loggedinTech={this.state.loggedinTech}
                                    loadAllComments={this.loadAllComments} />
                            </div>
                        }
                        {this.state.theTicket === null ? null :
                            this.state.allOfTheComments.slice().reverse().map((value, index) => {
                                return <Comment key={value.comment_ID} author_ID={value.author_name} text={value.text} creation_date={new Date(value.creation_date * 1000)} internal={value.internal} />
                            })
                        }
                    </div>
                </div>
            );
        }
    }
}
export default TicketPage;
