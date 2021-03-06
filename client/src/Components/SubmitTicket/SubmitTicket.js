import React, { Component } from 'react';

// material ui-imports
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FormLabel from "@material-ui/core/FormLabel";
import { FormControlLabel } from "@material-ui/core";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

//import CSS
import "./SubmitTicket.css";


// class of Ticket Form and Submission
class SubmitTicket extends Component {
    constructor(props) {
        super(props);

        // initialize state so that the state of the ticket is not submitted and it's information is blank
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            phone: '',
            location: '',
            subject: '',
            description: '',
            severity: '',
            submitted: false
        };

        // taken from Login.js to handle user input and submission
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
    }

    // handles user input
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    phoneChangeHandler(e) {
        // Adds dashes, limits to numbers only (with the dashes) 
        var number = e.target.value.split('-').join('');
        number = number.slice(0, 10);

        const numRegex = /^[0-9\b]+$/;
        if (number !== '' && !numRegex.test(number)) { return; }

        if (number.length > 3 && number.length < 7) {
            this.setState({ phone: number.slice(0, 3) + '-' + number.slice(3) });
        } else if (number.length > 6) {
            this.setState({ phone: number.slice(0, 3) + '-' + number.slice(3, 6) + '-' + number.slice(6) })
        }
        else {
            this.setState({ phone: number });
        }
    }

    // submit ticket
    submitHandler(e) {
        e.preventDefault();

        if (this.state.firstname.trim() === "") {
            //alert("Please enter your first name");
            NotificationManager.error('Please Enter Your First Name', '');
            return;
        }

        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
        if (this.state.email.trim() === "" || !emailRegex.test(this.state.email.trim())) {
            NotificationManager.error('Please Enter a Valid Email', '');
            return;
        }

        if (this.state.phone.trim() !== "") {
            if (this.state.phone.trim().length < 12) {
                NotificationManager.error('Please enter a complete phone number', '');
                return;
            }
        }

        if (this.state.subject.trim() === "") {
            //alert("Please enter a ticket subject");
            NotificationManager.error('Please Enter a Ticket Subject', '');
            return;
        }
        if (this.state.description.trim() === "") {
            //alert("Please enter a ticket description");
            NotificationManager.error('Please Enter a Ticket Description', '');
            return;
        }

        fetch('/submitTicket/', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: this.state.firstname.trim().replace(/"/g, '\''),
                lastname: this.state.lastname.trim().replace(/"/g, '\''),
                email: this.state.email.trim().replace(/"/g, '\''),
                phone: this.state.phone.trim(),
                location: this.state.location.trim(),
                subject: this.state.subject.trim().replace(/"/g, '\''),
                description: this.state.description.trim().replace(/"/g, '\''),
                severity: this.state.severity
            })
        })
            .then(response => response.text())
            .then(response => {
                if (response === "Ticket created successfully") {
                    //alert("Ticket Submitted!");
                    NotificationManager.success('Ticket Submitted!', '', 2000);
                } else {
                    this.setState({ submitted: true });
                    //alert("Error submitting ticket")
                    NotificationManager.error('Error Submitting Ticket', '');
                }
            });

        setTimeout(() => {
            this.props.history.push('/');
        }, 2000);

    }

    closeHandler() {
        this.props.history.push('/');
    }


    render() {
        // Styles Radio buttons 
        const theme = createMuiTheme({
            palette: {
                primary: { main: '#5C8021' }, // Purple and green play nicely together.
                secondary: { main: '#25551b' }, // This is just green.A700 as hex.
            },
        });


        return (
            <div>
                <NotificationContainer />
                <div className="hsuheader1">
                    <svg width="456" height="23" viewBox="0 0 456 23" role="img">
                        <path fill="#256918" d="M20.025 9.474v3.414c0 4.211.055 6.743.164 7.598.127 1.023.518 1.565 1.175 1.621v.471h-7.924v-.471c.643-.058 1.04-.514 1.192-1.371.114-.704.171-2.667.171-5.885v-1.343h-8.246v1.343c0 3.218.055 5.181.164 5.885.128.857.51 1.313 1.147 1.371v.471h-7.869v-.471c.643-.057 1.032-.598 1.165-1.621.113-.854.17-3.387.17-7.598v-3.414c0-3.927-.057-6.288-.17-7.084-.133-.987-.503-1.509-1.108-1.565v-.471h7.672v.471c-.564.057-.908.521-1.035 1.391-.09.699-.136 2.667-.136 5.901v.993h8.246v-1.022c0-3.235-.057-5.191-.171-5.872-.114-.87-.454-1.334-1.023-1.391v-.471h7.504v.471c-.526.057-.844.579-.951 1.565-.09.796-.136 3.157-.136 7.084zM25.05 12.31v-2.843c0-3.941-.056-6.301-.167-7.079-.113-.985-.449-1.506-1.01-1.563v-.471h7.7v.471c-.587.057-.935.578-1.045 1.562-.092.795-.137 3.153-.137 7.073v2.811c0 1.781.279 3.096.836 3.947.706 1.1 1.859 1.649 3.457 1.649 1.356 0 2.416-.53 3.178-1.59.595-.814.892-2.15.892-4.006v-2.811c0-3.92-.055-6.278-.166-7.073-.129-.984-.508-1.505-1.135-1.562v-.471h7.56v.471c-.538.057-.864.578-.975 1.563-.093.834-.14 3.194-.14 7.079v2.701c0 2.957-.625 5.353-1.875 7.191-.654.987-1.57 1.802-2.745 2.446-1.401.777-2.932 1.166-4.593 1.166-4.033 0-6.843-1.479-8.429-4.435-.803-1.478-1.205-3.553-1.205-6.226zM47.553 12.904l1.819-12.707h.756c4.63 7.428 7.373 11.994 8.233 13.7h.055c.821-1.629 3.612-6.196 8.373-13.7h.756l1.792 12.691c.559 4.115.961 6.648 1.204 7.596.243 1.044.606 1.584 1.092 1.623v.471h-7.505v-.471c.579-.039.869-.504.869-1.397 0-.475-.117-1.571-.35-3.291-.234-1.719-.387-3.273-.462-4.659h-.028c-.579 1.232-1.277 2.549-2.097 3.951-.746 1.289-1.912 3.126-3.496 5.514h-.755c-1.454-2.199-2.647-4.084-3.58-5.656-.746-1.25-1.426-2.531-2.041-3.838h-.028c-.075 1.178-.224 2.746-.447 4.702-.197 1.596-.297 2.641-.297 3.135 0 .97.309 1.483.924 1.539v.471h-7.225v-.471c.505-.039.887-.566 1.148-1.582.261-1.016.691-3.556 1.289-7.621zM83.771 15.713v-.029c0-1.134-.554-1.883-1.659-2.241-.451-.152-.937-.228-1.463-.228-.075 0-.422.019-1.04.058v4.284c0 .321.085.507.253.554.169.047.507.07 1.014.07.655 0 1.255-.161 1.799-.482.731-.454 1.097-1.117 1.097-1.985zm-.668-8.865v-.028c0-.684-.219-1.237-.657-1.664-.437-.426-1.03-.639-1.776-.639-.316 0-.671.029-1.062.085v4.548c.242.019.513.028.811.028.465 0 .904-.085 1.314-.256.913-.379 1.369-1.07 1.369-2.074zm5.969 9.346v.028c0 2.142-.897 3.791-2.692 4.946-1.478.967-3.777 1.45-6.9 1.45-.748 0-1.739-.014-2.973-.039-1.496-.039-2.478-.058-2.945-.058v-.492c.586-.019.933-.549 1.048-1.593.113-.872.169-3.395.169-7.567v-3.413c0-3.907-.047-6.257-.141-7.054-.114-.948-.434-1.46-.964-1.536v-.55h2.937c1.865-.026 3.051-.039 3.553-.039 1.585 0 2.929.171 4.03.511 1.045.324 1.921.882 2.631 1.677.895 1.006 1.343 2.255 1.343 3.752 0 1.119-.322 2.115-.964 2.985-.643.872-1.456 1.441-2.443 1.706v.056c1.183.228 2.178.816 2.985 1.763.882.984 1.325 2.14 1.325 3.468zM109.459 11.565v-.027c0-1.878-.574-3.478-1.72-4.805-1.148-1.325-2.598-1.991-4.353-1.991-1.884 0-3.404.651-4.56 1.949-1.158 1.298-1.735 2.922-1.735 4.873 0 1.898.573 3.489 1.72 4.777 1.148 1.289 2.645 1.934 4.492 1.934 1.828 0 3.311-.645 4.449-1.934 1.138-1.288 1.707-2.879 1.707-4.777zm5.536-.286v.027c0 3.342-1.129 6.127-3.387 8.358-2.257 2.232-5.065 3.347-8.424 3.347-3.265 0-6.027-1.096-8.284-3.29-2.258-2.191-3.386-4.892-3.386-8.1 0-3.38 1.142-6.16 3.428-8.344 2.286-2.183 5.136-3.275 8.551-3.275 3.284 0 6.017 1.044 8.2 3.132 2.201 2.145 3.302 4.86 3.302 8.146zM118.431 12.88v-3.408c0-3.902-.057-6.25-.169-7.045-.132-.966-.507-1.487-1.127-1.562v-.51h7.7v.51c-.592.075-.955.597-1.088 1.565-.116.835-.172 3.187-.172 7.055v8.167c0 .378.197.569.591.569h3.795c.656 0 1.204-.118 1.645-.35.44-.233.707-.543.801-.931h.51c-.057 1.88-.103 3.76-.139 5.64h-13.558v-.55c.582-.057.938-.597 1.071-1.619.094-.795.141-3.305.141-7.529zM147.512 11.281v-.028c0-2.311-.717-4.047-2.148-5.203-1.06-.833-2.428-1.25-4.103-1.25-.335 0-.856.038-1.563.114v12.479c0 .303.084.473.251.512.279.076.689.114 1.228.114 1.6 0 2.921-.418 3.963-1.252 1.581-1.269 2.372-3.097 2.372-5.486zm5.536-.309v.029c0 4.071-1.512 7.215-4.536 9.428-1.997 1.459-4.816 2.188-8.457 2.188-.541 0-1.203-.009-1.987-.024-.952-.016-1.549-.025-1.792-.025-.784-.014-1.829-.038-3.136-.07v-.471c.643-.075 1.032-.616 1.165-1.621.113-.834.17-3.347.17-7.537v-3.413c0-3.887-.057-6.219-.17-6.996-.133-.91-.503-1.403-1.108-1.478v-.529c.727-.036 1.875-.083 3.444-.139 3.136-.052 4.573-.078 4.312-.078 3.023 0 5.478.53 7.363 1.59 1.587.928 2.792 2.254 3.613 3.976.746 1.534 1.119 3.257 1.119 5.169zM160.954 12.896v-8.302h-3.458c-1.302 0-2.073.486-2.314 1.456h-.51v-5.697h17.787v5.697h-.471c-.281-.97-1.048-1.456-2.303-1.456h-3.509v8.302c0 4.208.056 6.748.169 7.619.15 1.06.561 1.592 1.235 1.592v.471h-7.925v-.471c.625-.075 1.004-.625 1.132-1.649.111-.854.167-3.374.167-7.562z">
                        </path>
                        <path fill="#87a625" d="M194.856 16.352v.029c0 1.931-.7 3.492-2.1 4.684-1.4 1.193-3.231 1.789-5.49 1.789-2.016 0-3.622-.294-4.818-.883.037-1.003.103-2.937.197-5.799h.471c.43 1.47 1.656 2.205 3.677 2.205 1.685 0 2.527-.654 2.527-1.962 0-.72-.477-1.46-1.432-2.219-.488-.358-1.21-.917-2.163-1.676-2.08-1.593-3.119-3.488-3.119-5.687 0-1.896.645-3.449 1.934-4.663 1.363-1.289 3.232-1.933 5.605-1.933 1.42 0 2.634.17 3.644.51-.06 1.172-.111 3.083-.15 5.731h-.47c-.149-.522-.475-.962-.978-1.318-.429-.299-1.007-.448-1.733-.448-.746 0-1.338.175-1.776.526-.437.349-.657.808-.657 1.376 0 .644.346 1.259 1.036 1.845.485.416 1.391 1.145 2.717 2.186 2.052 1.666 3.079 3.568 3.079 5.707zM202.982 12.896v-8.302h-3.458c-1.303 0-2.073.486-2.314 1.456h-.51v-5.697h17.788v5.697h-.472c-.281-.97-1.049-1.456-2.303-1.456h-3.508v8.302c0 4.208.055 6.748.167 7.619.15 1.06.562 1.592 1.237 1.592v.471h-7.925v-.471c.626-.075 1.004-.625 1.132-1.649.111-.854.167-3.374.167-7.562zM220.297 15.157h3.359l-.028-.085-.951-2.662c-.355-1-.569-1.68-.644-2.038h-.056c-.057.225-.617 1.792-1.68 4.699v.085zm4.761 4.044h-6.218c-.447 1.108-.672 1.844-.672 2.207 0 .401.225.62.672.659v.51h-7.42v-.51c.429-.039.915-.569 1.457-1.593.503-.967 1.641-3.507 3.416-7.621l5.544-12.853h.84l5.459 12.853c1.755 4.114 2.875 6.646 3.362 7.593.541 1.043 1.025 1.582 1.454 1.621v.51h-7.867v-.51c.429-.039.644-.258.644-.659 0-.344-.223-1.08-.671-2.207zM236.75 12.896v-8.302h-3.458c-1.303 0-2.073.486-2.314 1.456h-.51v-5.697h17.788v5.697h-.471c-.282-.97-1.049-1.456-2.303-1.456h-3.508v8.302c0 4.208.055 6.748.167 7.619.15 1.06.562 1.592 1.237 1.592v.471h-7.925v-.471c.625-.075 1.004-.625 1.132-1.649.111-.854.167-3.374.167-7.562zM251.612 12.888v-3.414c0-3.907-.057-6.268-.17-7.084-.113-.987-.444-1.509-.992-1.565v-.471h13.412l-.157 5.584h-.471c-.147-.895-1.21-1.343-3.186-1.343h-3.214v4.633h2.738c1.004 0 1.679-.039 2.025-.117.343-.078.562-.265.656-.558h.432v5.629h-.432c-.131-.371-.528-.605-1.196-.697-.185-.037-.666-.055-1.443-.055h-2.779v3.878c0 .513.187.818.559.913 1.656.018 2.951.018 3.882 0 1.451-.039 2.262-.447 2.43-1.224h.472c-.076 2.886-.113 4.747-.113 5.582h-13.67v-.471c.585-.057.934-.598 1.048-1.621.113-.854.17-3.387.17-7.598zM276.294 12.31v-2.843c0-3.941-.057-6.301-.167-7.079-.112-.985-.449-1.506-1.011-1.563v-.471h7.701v.471c-.587.057-.935.578-1.046 1.562-.09.795-.137 3.153-.137 7.073v2.811c0 1.781.281 3.096.837 3.947.707 1.1 1.858 1.649 3.458 1.649 1.356 0 2.415-.53 3.178-1.59.593-.814.89-2.15.89-4.006v-2.811c0-3.92-.055-6.278-.165-7.073-.129-.984-.508-1.505-1.134-1.562v-.471h7.56v.471c-.54.057-.864.578-.976 1.563-.094.834-.14 3.194-.14 7.079v2.701c0 2.957-.626 5.353-1.875 7.191-.655.987-1.569 1.802-2.746 2.446-1.399.777-2.931 1.166-4.592 1.166-4.033 0-6.843-1.479-8.431-4.435-.802-1.478-1.204-3.553-1.204-6.226zM318.725 9.462v13.352h-.757c-4.45-3.842-7.469-6.491-9.058-7.949-1.384-1.231-2.777-2.613-4.179-4.145h-.084c.04 1.027.06 1.864.06 2.512 0 4.033.056 6.469.168 7.306.111 1.009.465 1.531 1.06 1.57v.471h-7.197v-.471c.595-.057.958-.598 1.09-1.623.111-.853.167-3.385.167-7.596v-12.691h.784c4.5 3.979 7.515 6.688 9.047 8.128 1.363 1.309 2.746 2.71 4.145 4.207h.084c-.028-1.364-.042-2.481-.042-3.353 0-3.769-.056-6.053-.17-6.848-.131-.948-.518-1.45-1.161-1.506v-.471h7.169v.471c-.55.057-.878.578-.989 1.562-.093.796-.138 3.153-.138 7.074zM329.37 9.47v3.407c0 4.185.057 6.694.166 7.526.128 1.004.509 1.572 1.147 1.705v.471h-7.87v-.471c.645-.115 1.032-.664 1.165-1.652.113-.835.169-3.341.169-7.518v-3.446c0-3.909-.056-6.263-.169-7.061-.134-.949-.503-1.471-1.108-1.566v-.51h7.698v.51c-.582.114-.926.644-1.035 1.59-.109.814-.164 3.151-.164 7.015zM349.69 9.467l-6.048 13.504h-.783l-6.245-13.504c-1.772-3.828-2.911-6.188-3.416-7.079-.54-.985-1.035-1.506-1.483-1.563v-.471h8.148v.471c-.56.038-.84.275-.84.71 0 .493.671 2.236 2.016 5.229.877 1.97 1.651 3.893 2.324 5.768h.083c.599-1.78 1.335-3.675 2.213-5.684 1.307-3.069 1.959-4.859 1.959-5.371 0-.398-.233-.615-.698-.653v-.471h7.588v.471c-.449.057-.934.559-1.457 1.507-.523.948-1.644 3.326-3.36 7.135zM356.919 12.888v-3.414c0-3.907-.057-6.268-.17-7.084-.113-.987-.444-1.509-.992-1.565v-.471h13.412l-.157 5.584h-.471c-.147-.895-1.21-1.343-3.186-1.343h-3.214v4.633h2.738c1.005 0 1.679-.039 2.025-.117.345-.078.562-.265.656-.558h.432v5.629h-.432c-.131-.371-.527-.605-1.195-.697-.185-.037-.666-.055-1.445-.055h-2.779v3.878c0 .513.187.818.559.913 1.656.018 2.951.018 3.882 0 1.453-.039 2.262-.447 2.43-1.224h.472c-.075 2.886-.113 4.747-.113 5.582h-13.67v-.471c.585-.057.934-.598 1.048-1.621.113-.854.17-3.387.17-7.598zM382.862 7.425v-.027c0-.849-.251-1.529-.751-2.04-.503-.508-1.188-.764-2.061-.764l-1.114.056v5.805c.203.019.482.029.836.029.705 0 1.336-.188 1.893-.566.798-.567 1.198-1.397 1.198-2.494zm-8.874 5.468v-3.413c0-3.924-.056-6.284-.167-7.081-.113-.985-.437-1.498-.972-1.535v-.454c.223 0 1.302-.018 3.237-.056 2.42-.079 3.573-.118 3.462-.118 1.656 0 3.08.209 4.271.626 2.789.968 4.186 3.085 4.186 6.35 0 2.071-.691 3.712-2.072 4.928-.553.475-1.06.835-1.52 1.082v.057c.633.913 2.249 3.161 4.845 6.749.913 1.273 1.642 1.964 2.183 2.079v.471h-5.455c-.691 0-1.167-.124-1.427-.373-1.549-2.434-3.199-5.058-4.952-7.874h-.671v1.228c0 2.822.045 4.575.139 5.262.129.8.444 1.228.943 1.286v.471h-7.169v-.471c.556-.057.888-.598 1-1.621.092-.834.139-3.365.139-7.593zM404.521 16.352v.029c0 1.931-.701 3.492-2.1 4.684-1.403 1.193-3.231 1.789-5.491 1.789-2.018 0-3.622-.294-4.817-.883.037-1.003.101-2.937.197-5.799h.471c.429 1.47 1.655 2.205 3.677 2.205 1.684 0 2.527-.654 2.527-1.962 0-.72-.48-1.46-1.433-2.219-.488-.358-1.208-.917-2.163-1.676-2.079-1.593-3.118-3.488-3.118-5.687 0-1.896.643-3.449 1.934-4.663 1.363-1.289 3.231-1.933 5.605-1.933 1.419 0 2.634.17 3.643.51-.06 1.172-.109 3.083-.149 5.731h-.471c-.15-.522-.477-.962-.98-1.318-.428-.299-1.006-.448-1.733-.448-.746 0-1.338.175-1.775.526-.439.349-.656.808-.656 1.376 0 .644.345 1.259 1.035 1.845.485.416 1.391 1.145 2.716 2.186 2.053 1.666 3.081 3.568 3.081 5.707zM413.902 9.47v3.407c0 4.185.055 6.694.164 7.526.128 1.004.509 1.572 1.147 1.705v.471h-7.869v-.471c.644-.115 1.032-.664 1.164-1.652.115-.835.171-3.341.171-7.518v-3.446c0-3.909-.056-6.263-.171-7.061-.131-.949-.5-1.471-1.108-1.566v-.51h7.701v.51c-.582.114-.927.644-1.037 1.59-.108.814-.162 3.151-.162 7.015zM423.509 12.896v-8.302h-3.457c-1.302 0-2.072.486-2.315 1.456h-.51v-5.697h17.787v5.697h-.471c-.281-.97-1.048-1.456-2.301-1.456h-3.51v8.302c0 4.208.056 6.748.169 7.619.15 1.06.562 1.592 1.235 1.592v.471h-7.923v-.471c.625-.075 1.003-.625 1.132-1.649.111-.854.166-3.374.166-7.562zM449.959 10.328l-1.733 3.044v1.338c0 3.281.056 5.274.167 5.975.129.873.516 1.348 1.161 1.423v.471h-7.867v-.471c.617-.057 1-.522 1.15-1.396.111-.685.167-2.66.167-5.927v-1.025l-1.847-3.334c-2.634-4.748-4.109-7.379-4.426-7.892-.673-1.063-1.251-1.633-1.738-1.709v-.471h8.01v.471c-.412.038-.618.227-.618.568 0 .36.477 1.459 1.429 3.296.485.946 1.111 2.188 1.876 3.721h.056c.169-.379.793-1.567 1.877-3.563 1.083-2 1.623-3.179 1.623-3.539 0-.284-.177-.444-.531-.482v-.471h7.392v.471c-.411.076-.941.625-1.593 1.65-.409.645-1.929 3.262-4.554 7.853z">
                        </path>
                    </svg>
                </div>
                <div className="appbarHome">
                    <h1 className="titleHome">
                        ResNet Helpdesk
                    </h1>
                </div>
                <MuiThemeProvider theme={theme}>
                    <form className="submitTicket" onSubmit={e => this.submitHandler(e)}>
                        <IconButton
                            className="exit_submit_ticket"
                            aria-label="close"
                            onClick={this.closeHandler}
                        >
                            <CloseIcon color="primary" fontSize="large" />
                        </IconButton>
                        <h1 className="submitTicketHeader"> Submit Ticket </h1>
                        <div className={"centerPlease"} >
                        <TextField
                            required
                            className="medium"
                            label="First Name"
                            name="firstname"
                            margin="normal"
                            variant="filled"
                            value={this.state.firstname}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            className="medium"
                            label="Last Name"
                            name="lastname"
                            margin="normal"
                            variant="filled"
                            value={this.state.lastname}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            required
                            className="medium"
                            label="Student Email Address"
                            name="email"
                            margin="normal"
                            variant="filled"
                            value={this.state.email}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            className="medium"
                            label="Phone Number"
                            name="phone"
                            margin="normal"
                            variant="filled"
                            value={this.state.phone}
                            onChange={e => this.phoneChangeHandler(e)}
                        />
                        <FormLabel component="legend" style={{paddingTop:'1em'}}> Location </FormLabel>
                        <RadioGroup
                            style={{paddingLeft:'1em'}}
                            aria-label="location"
                            name="location"
                            value={this.state.location}
                            onChange={e => this.changeHandler(e)}>
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Canyon"
                                value="canyon" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="The Hill"
                                value="hill" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Cypress"
                                value="cypress" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Creekview"
                                value="creekview" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Campus Apartments"
                                value="campus_apartments" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="College Creek"
                                value="college_creek" />
                        </RadioGroup>

                        <TextField
                            className="medium"
                            required
                            label="Ticket Subject"
                            name="subject"
                            margin="normal"
                            variant="outlined"
                            value={this.state.subject}
                            onChange={e => this.changeHandler(e)}
                        />
                        <TextField
                            required
                            className="medium"
                            label="Description of Issue"
                            name="description"
                            multiline
                            margin="normal"
                            variant="outlined"
                            rows="5"
                            value={this.state.description}
                            onChange={e => this.changeHandler(e)}
                        />
                        <FormLabel componet="legend" style={{paddingTop:'1em'}}> Urgency </FormLabel>
                        <RadioGroup
                            style={{paddingLeft:'1em'}}
                            aria-label="severity"
                            name="severity"
                            value={this.state.severity}
                            onChange={e => this.changeHandler(e)}>
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="High"
                                value="high" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Medium"
                                value="medium" />
                            <FormControlLabel
                                control={<Radio color="primary" />}
                                label="Low"
                                value="low" />
                        </RadioGroup>
                        </div>
                        <button
                            className="submitTicketButton"
                            color="primary"
                            type="submit">
                            Submit Ticket
                        </button>
                    </form>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default SubmitTicket;