import axios from "axios";
import React, {
    useEffect,
    useState,
    useRef
} from "react";
import {
    isLoggedIn
} from '../helpers';
import {
    useLoaderData, useParams
} from 'react-router-dom';
import { useNavigate, Form } from "react-router-dom";
import {Logo} from './Logo';
import '../styles/SPIncomePage.css';
import { useOutsideCallback } from "../helpers";
import { faSliders, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


async function getTask(parameters) {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let newData = await axios.get('api/records', {
        params: {
            ...parameters
        }
    }).then(response => {
        return response.data
    }).catch(error => {
        console.log(error)
    });
    return newData;
};

export async function tasksLoader({ params, request }) {
    if (request.url.includes('?')){
        let urls = request.url.split('?');
        let newParams = {};
        if(urls.length == 2){
            urls = urls[1].split('&');
            for (const param of urls) {
                let values = param.split('=');
                if(urls.length == 2) {
                    newParams[values[0]] = values[1];
                }
            }
        }
        params = {...params, ...newParams};
    }
    const taskData = await getTask(params);
    return taskData;
};

function DateLabel(props) {
    return (
        <div className="date-wrapper">
            <p>{props.date_label}</p>
        </div>
    );
};

function groupTasksByDate(tasksData, category_id) {
    let taskGroups = {};
    for (let index = 0; index < tasksData.length; index++) {
        const element = tasksData[index];
        element['date_parsed'] = new Date(element['record_time']);
        // element['date_formatted'] = element['date_parsed'] 
        let n_group = element['date_parsed'].toLocaleDateString();
        if (!taskGroups.hasOwnProperty(n_group)) {
            taskGroups[n_group] = [<DateLabel date_label={n_group} key={n_group} />];
        }
        taskGroups[n_group].push(<Task task={element} key={element.id} category_id={category_id}/>)

    }

    let sortable = [];
    let sortedDates = Object.keys(taskGroups).sort((x, y) => {
        let a = new Date(x);
        let b = new Date(y);
        if (a > b) {
            return -1;
        }
        else if (a < b) {
            return 1;
        }
        else {
            return 0;
        }
    });
    for (var sample_date of sortedDates) {
        sortable.push(taskGroups[sample_date]);
    }
    return sortable;
}

function TaskForm(props) {
    let wrapperRef = useRef(null);

    useOutsideCallback(wrapperRef, props.cancelCreation);

    let isHide = props.isEditable ? "" : " hide";

    let isPresentTask = props.hasOwnProperty('task')

    let task = isPresentTask? props.task : {category_id: props.category_id}

    return (
        <Form className={"task-row editable-row" + isHide} ref={wrapperRef} id="task-form" method={props.method} action="" onSubmit={props.submitHandler}>
            <textarea required={true} name="task_name" id="task-name" className="task-name" defaultValue={task.task_name} placeholder="Record name"></textarea>
            <input type="number" defaultValue={task.sum} required={true} name="sum" id="sum" className="price" step="0.01" min={0} placeholder="Input sum" />
            <input type="datetime-local" defaultValue={task.record_time} name="record_time" id="record-time" required />
            <input type="hidden" name="id" defaultValue={task.id}/>
            <input type="hidden" name="category_id" defaultValue={task.category_id}/>
            <div className="accept-wrapper">
                <button className="accept" type="submit">&#10003;</button>
                <div className="decline" onClick={props.cancelCreation}>&#10006;</div>
            </div>
        </Form>
    )
}


class StaticTask extends React.Component {
    render () {
        let task = this.props.task;
        return (
            <div className="task-row" id={task.id} onClick={this.props.editHandler}>
                <p className="category-name">{task.category_name}</p>
                <p className="task-name">
                    {task.task_name}
                </p>
                <p className="price">{task.sum}&#8372;</p>
                {/* <Form className="action-btns" method="post" action="">
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="method" value="delete" />
                    <button className="accept" onClick={this.props.editHandler}>&#x270E;</button>
                    <button className="decline" onClick={this.props.deleteHandler}  type="submit">&#128465;</button>
                </Form> */}
            </div>
        )
    }
}


class Task extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isEditMode: false,
            isDelete: true
        }
    };

    setEditTask = () => {
        this.setState({isEditMode: true});
    } 

    cancelEdit = () => {
        this.setState({isEditMode: false});
    }

    finishEdit = () => {
        this.setState({isEditMode: false});
    }

    render() {
        let task = this.props.task;
        let taskRow = <StaticTask task={this.props.task} editHandler={this.setEditTask}/>;

        if (this.state.isEditMode === true) {
            taskRow = <TaskForm task={this.props.task} category_id={this.props.category_id} isEditable={true} cancelCreation={this.cancelEdit} submitHandler={this.finishEdit} method="put"/>
        }

        return (
            <>
                {taskRow}
            </>
        )
    }
};

export async function createTask({ params, request }) {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let data = await request.formData();
    const updates = Object.fromEntries(data);
    let newData = {};
    if (updates.id !== ''){
        let newData = await axios.put('api/records/' + updates.id , updates).then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        });
    }
    else if(updates.method === 'delete'){
        let newData = await axios.delete('api/records/' + updates.id , updates).then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        });
    }
    else {
        let newData = await axios.post('api/records', data).then(response => {
            return response.data
        }).catch(error => {
            console.log(error)
        });
    }
    let form = document.getElementById('task-form');
    form.reset();
    return newData;
};

function DateForm(props){

    let wrapperRef = useRef(null);

    useOutsideCallback(wrapperRef, props.hideForm);

    return (
        <Form id="date-filter-form" method="get" ref={wrapperRef}>
            <fieldset>
                <legend>Test</legend>
                <div className="input-row">
                    <label htmlFor="date_start">Start Date</label>
                    <input type="date" name="date_start" id="date_start" />
                </div>
                <div className="input-row">
                    <label htmlFor="date_start">End Date</label>
                    <input type="date" name="date_end" id="date_end" />
                </div>
            </fieldset>
            <div className="filter-btn-wrapper">
                <button id="filter-btn" type="submit">Search</button>
            </div>
        </Form>
    )
}

function PageHeader(props) {
    let [isVisible, setVisible] = useState(false);

    const hideForm = () => {
        setVisible(false);
    }

    return (
        <div className="page-header">
            <p>Records List</p>
            <div className="filters-wrapper">
                <span className="fa-filter" onClick={() => setVisible(!isVisible)}><span>Filter</span> <FontAwesomeIcon icon={faSliders} /></span>
                {isVisible? <DateForm hideForm={hideForm}/> : ''}
            </div>
        </div>
    );
}

export function SpendIncomePage() {
    const tasksData = useLoaderData();

    const urlParams = useParams();

    const [isCreatable, setCreatable] = useState(false);

    const [isEditable, setEditable] = useState(false);

    function editTask() {
        setEditable(true);
    }

    function createNewTask() {
        setCreatable(true);
    }

    function cancelCreation() {
        setCreatable(false);
    }

    async function submitHandler(params) {
        let form = document.getElementById('task-form');
        if (form.reportValidity() === true) {
            setCreatable(false);
        }
    }

    const a = groupTasksByDate(tasksData, urlParams['category_id']);

    return (
        <div className="tasks-wrapper">
            <PageHeader />
            {
                a
            }
            {isCreatable ? "" :
                <div className="add" onClick={createNewTask}>
                    <p>+</p>
                </div>}
            <TaskForm category_id={urlParams['category_id']} submitHandler={submitHandler} cancelCreation={cancelCreation} key="newRow" method="post" isEditable={isCreatable} />

        </div>
    )
}