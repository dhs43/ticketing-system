import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Paper from '@material-ui/core/Paper';
import InventoryTable from "./InventoryTable";
import "./InventoryPage.css";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class InventoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allOfTheInventory: [],
            loggedin: true,
            selected: [],
        };

        this.loadInventory();
        this.submitInventoryHandler = this.submitInventoryHandler.bind(this);
        this.deleteInventoryHandler = this.deleteInventoryHandler.bind(this);
        this.updateInventoryHandler = this.updateInventoryHandler.bind(this);

    }

    //load inventory
    loadInventory() {
            fetch('/inventory/all_devices', {
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
                    this.setState({ allOfTheInventory: data.reverse() })
                })
                .catch(err => console.log(err))
    }

    //add inventory item
    submitInventoryHandler(newData) {
        fetch('/inventory/new_device', {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                title: newData.title.trim(),
                model: newData.model.trim(),
                serial_number: newData.serial_number.trim(),
                location: newData.location.trim(),
                status: newData.status.trim(),
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Device saved successfully") {
                    this.loadInventory();
                    NotificationManager.success('Device Saved Successfully', '');
                } else {
                    console.log(response);
                    this.setState({ submitted: true });
                    alert("Error adding inventory object");
                }
            });
    }

    //update inventory item
    updateInventoryHandler(newData) {
        fetch('/inventory/update_device/' + (newData.device_ID), {
            method: 'post',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token },
            body: JSON.stringify({
                title: newData.title.trim(),
                model: newData.model.trim(),
                serial_number: newData.serial_number.trim(),
                location: newData.location.trim(),
                status: newData.status.trim(),
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response !== "Device updated successfully") {
                    console.log(response);
                    this.setState({ submitted: true });
                    alert("Error updating device");
                } else {
                    this.loadInventory();
                    NotificationManager.success('Device Updated Successfully', '');
                }
            });
    }


        //delete inventory item
        deleteInventoryHandler(newData) {
            fetch('/inventory/delete/' + (newData.device_ID), {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.token }
            })
                .then(response => response.text())
                .then(response => {
                    if (response === "Device deleted successfully") {
                        this.loadInventory();
                        NotificationManager.success('Device Deleted Successfully', '');
                    } else {
                        alert("Error deleting item");
                    }
                });
    }

    render() {
        if (this.state.loggedin === false) {
            return <Redirect to='/' />
        } else {
            return (
                <div className="ticketPage">
                    <NotificationContainer/>
                    <Paper>
                        <InventoryTable
                            allOfTheInventory={this.state.allOfTheInventory}
                            submitInventoryHandler={this.submitInventoryHandler}
                            updateInventoryHandler={this.updateInventoryHandler}
                            deleteInventoryHandler={this.deleteInventoryHandler}
                        />
                    </Paper>
                </div>
            );
        }
    }
}
export default InventoryPage;
