import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice.js';
import { fetchPizza } from '../redux/slices/pizzasSlice.js';
import QueryString from 'qs';
import { useNavigate } from 'react-router-dom';
import { sortList } from './../components/Sort/Sort.js';
import Categories from './../components/Categories/Categories.js';
import Sort from './../components/Sort/Sort.js';
import PizzaBlock from './../components/PizzaBlock/PizzaBlock.js';
import Skeleton from './../components/PizzaBlock/Skeleton.js';
import Pagination  from '../components/Pagination/Pagination.js';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = useRef(false);
    const isMounted = useRef(false);
    const {categoryId, sort, currentPage, searchValue} = useSelector(state => state.filter);
    const {items, status} = useSelector(state => state.pizzas);
    const sortType = sort.sortProperty;

    const onCangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const getPizzas = async () => {
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const sort = sortType.replace('-', '');
        const order = sortType.includes('-') ? 'desc' : 'asc';
        const search = searchValue ? `&search=${searchValue}` : '';
        const pagination = `page=${currentPage}`;
           
        dispatch(fetchPizza(
            category,
            sort,
            order,
            search,
            pagination
        ))
        window.scrollTo(0, 0);
    }

    useEffect(() => {   
        if(isMounted.current) {
            const querySrting = QueryString.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage
            })
            navigate(`?${querySrting}`)
        }
        isMounted.current = true;
    }, [categoryId, sortType, currentPage, searchValue])

    useEffect(() => {
        if(window.location.search) {
            const params = QueryString.parse(window.location.search.substring(1));
            const sort = sortList.find(obj => obj.sortProperty === params.sortProperty)
            dispatch(
                setFilters({
                    ...params,
                    sort
                })
            )
            isSearch.current = true;
        }
    }, [])

	useEffect(() => {
        getPizzas()
        isSearch.current = false;
	}, [categoryId, sortType, searchValue, currentPage])


   

    const onClickCategory = (i) => {
        dispatch(setCategoryId(i))
    }
    let pizzas = items
    .map((obj) => (<PizzaBlock key={obj.id} {...obj}/>));
    const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index}/> ) 
    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={(id) => onClickCategory(id)}/>
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    status === "error" ? 
                    <div>
                        <h2>произошла ошибка</h2>
                    </div> 
                    : 
                    (
                        status === "loading" ? skeletons : pizzas
                    )

                }
            </div>
            <Pagination currentPage={currentPage} onChangePage={onCangePage} />
        </div>
    )
}
export default Home;