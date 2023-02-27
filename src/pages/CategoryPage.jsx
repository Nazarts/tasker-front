import React, {useState} from "react";
import { Link, useParams, useLoaderData, Form } from "react-router-dom";
import axios from "axios";
import { Logo } from "./Logo";
import '../styles/CategoryPage.css';
import { colorPalleteMaker } from "../helpers";

async function getCategories(parameters) {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let newData = await axios.get('api/categories', {
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

export async function categoriesLoader({ params }) {
    const categoriesData = await getCategories(params);
    if (typeof(categoriesData) === 'object') {
        let newCategoriesData = [];
        for (const key in categoriesData) {
            if (Object.hasOwnProperty.call(categoriesData, key)) {
                const element = categoriesData[key];
                newCategoriesData.push(element);
            }
        };
        return newCategoriesData;
    }
    return categoriesData;
};

function CategoryTab(props) {
    let divStyle = {
        background: 'white'
    }
    return (
        <div className="category" style={divStyle}>
            <p>
                <Link to={"" + props.category.id}>{props.category.category_name}</Link>
            </p>
        </div>
    )
}


export async function createCategory({ params, request }) {
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:8000';
    let data = await request.formData();
    const updates = Object.fromEntries(data);
    console.log(updates);
    let newData = await axios.post('api/categories', data).then(response => {
        return response.data
    }).catch(error => {
        console.log(error)
    });
    let form = document.getElementById('category-form');
    form.reset();
    return newData
}


function CategoryForm(props) {
    return (
        <Form className="category category-form" id="category-form" method="post">
            <textarea name="category_name" id="category_name" placeholder="Category name"></textarea>
            <input type="hidden" name="record_type_id" defaultValue={props.type_id}/>
            <button type="submit" className="create-btn">&#10003;</button>
        </Form>
    )
}

function NewCategory(props) {
    return (
        <div className="category new-category" onClick={props.handleClick}>
            <p>
                + Add new category
            </p>
        </div>
    )
}

export function CategoryPage() {

    const [isCreatable, setCreatable] = useState(false);

    let params = useParams();

    let categoriesData = useLoaderData();

    let categoryList = [];

    let collorPallete = colorPalleteMaker(categoriesData.length)

    for (let index = 0; index < categoriesData.length; index++) {
        const element = categoriesData[index];

        categoryList.push(<CategoryTab category={element} key={element.id} color={collorPallete[index]}/>);
        
    }
    
    return (
        <>
            {/* <Logo /> */}
            <div className="cat-page-content">
                <h1 className="cat-page-title">Select your category</h1>
                <div className="categories-wrapper">
                    {categoryList}
                    {isCreatable?<CategoryForm type_id={params['type']}/>: <NewCategory handleClick={setCreatable}/>}
                </div>
            </div>
        </>
    );
}