import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import { MarkAsRead } from '../Activity/Activity';

class NewComment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newComment: null,
            internal: false
        };

        this.handleSaveComment = this.handleSaveComment.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSaveComment() {
        if (this.state.newComment.trim() === '') {
            return null;
        }

        fetch('/comments/new/' + this.props.theTicket.ticket_ID, {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                firstname: this.props.firstname,
                author_id: this.props.loggedinTech.technician_ID,
                author_name: this.props.loggedinTech.firstname + ' ' + this.props.loggedinTech.lastname,
                text: this.state.newComment,
                internal: this.state.internal
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Comment created successfully") {
                    this.setState({ newComment: '', internal: 'false' }); // Clear textbox
                    this.props.loadAllComments(this.props.theTicket.ticket_ID);

                    // Mark read so your own comments don't show in activity
                    MarkAsRead(this.props.theTicket.ticket_ID, this.props.loggedinTech.technician_ID);
                } else {
                    alert("Error saving comment");
                }
            });
    }

    render() {
        // Styles
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#FFA500' }, // orange
                secondary: { main: '#25551b' } // dark green
            },
        });

        if (this.props.theTicket !== null && this.props.loggedinTech.technician_ID !== null) {
            return (
                <div className="theBox">
                    <MuiThemeProvider theme={theme}>
                        <TextField
                            name="newComment"
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
            );
        } else {
            return (<div />);
        }
    }
}

export default NewComment;