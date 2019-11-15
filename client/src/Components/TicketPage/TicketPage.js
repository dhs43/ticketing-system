import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from "@material-ui/core/TextField";
import Comment from "../Comment/Comment.js";
import TicketTable from "./TicketTable";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import "./TicketPage.css";

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
                "is_admin": false
            }
        };

        this.loadTechnician();
        this.loadAllTickets();
        this.loadAllTickets = this.loadAllTickets.bind(this);
        this.loadAllComments = this.loadAllComments.bind(this);
        this.loadTicket = this.loadTicket.bind(this);
        this.handleSaveComment = this.handleSaveComment.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.CreateCommentUI = this.CreateCommentUI.bind(this);
        this.loadTechnician = this.loadTechnician.bind(this);
        this.submitTicketHandler = this.submitTicketHandler.bind(this);
        this.ticketManagement = this.ticketManagement.bind(this);
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
                        is_admin: data.active_user
                    }
                }))
                .catch(err => console.log(err))
        }
    }

    loadAllTickets() {
        fetch('/tickets/all', {
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
                this.setState({ allOfTheTickets: data })
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
    }

    loadAllComments(num) {
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
            .then(data => this.setState({ allOfTheComments: data }))
            .catch(err => console.log(err))
    }

    handleSaveComment() {
        if(this.state.newComment.trim() === '') {
            return null;
        }

        fetch('/comments/new/' + this.state.theTicket.ticket_ID, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                firstname: this.state.firstname,
                author_id: this.state.loggedinTech.technician_ID,
                author_name: this.state.loggedinTech.firstname + ' ' + this.state.loggedinTech.lastname,
                text: this.state.newComment,
                internal: this.state.internal
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Comment created successfully") {
                    this.setState({ newComment: '', internal: 'false' }); // Clear textbox
                    this.loadAllComments(this.state.theTicket.ticket_ID);
                } else {
                    alert("Error submitting ticket");
                }
            });
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    } 

    CreateCommentUI() {
        // Styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#FFA500' }, // orange
                secondary: { main: '#25551b' } // dark green
            },
        });

        if (this.state.theTicket !== null && this.state.loggedinTech.technician_ID !== null) {
            return (
                <div className="theBox">
                    <MuiThemeProvider theme={theme}>
                        <TextField
                        name = "newComment"
                        value={this.state.newComment}
                        onChange={e => this.changeHandler(e)}
                        label="Add a comment..."
                        fullWidth
                        multiline
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        />
                        <button
                            className="button"
                            onClick={this.handleSaveComment}>
                            Add Comment
                        </button>
                    </MuiThemeProvider>
                </div>
            )
        } else {
            return (<div />);
        }
    }

    submitTicketHandler() {
        this.props.history.push('/SubmitTicket');
    }

    ticketManagement(num){
       return(
           <div>
               <Button> Delete Ticket </Button>
               <Button> Accept Ticket </Button>
               <Button> Assign Ticket </Button>
           </div>
       ) ;
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <Paper>
                        <Toolbar>
                            <div className="toolbar">
                                <button className="button2" onClick={this.submitTicketHandler}>
                                    Create Ticket
                                </button>
                            </div>
                        </Toolbar>
                        <TicketTable
                            allOfTheTickets={this.state.allOfTheTickets}
                            loadTicket={this.loadTicket}
                        />
                    </Paper>
                    <div className="marginTop">
                        {this.state.theTicket === null ? null :
                            <div className="description">
                                {this.ticketManagement(this.state.theTicket)}
                                {this.state.theTicket === null ? null : <h3>{this.state.theTicket.subject}</h3>}
                                {this.state.theTicket === null ? null : <p>{this.state.theTicket.description}</p>}
                            </div>
                        }
                    </div>
                    <div className="comment-area">
                        {this.state.theTicket === null ? null : 
                            <div className="commentUI">
                                <this.CreateCommentUI />
                            </div>
                        } 
                        {this.state.theTicket === null ? null : 
                            this.state.allOfTheComments.slice().reverse().map((value, index) => {
                            return <Comment key={value.comment_ID} author_ID={value.author_name} text={value.text} creation_date={new Date(value.creation_date * 1000)} />
                        })
                        }
                    </div>
                </div>
            );
        }
    }
}
export default TicketPage;
