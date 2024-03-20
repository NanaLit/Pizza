import React, {useState, useEffect, useContext, useRef} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice.js';
import axios from 'axios';
import QueryString from 'qs';
import { useNavigate } from 'react-router-dom';
import { sortList } from './../components/Sort/Sort.js';
import Categories from './../components/Categories/Categories.js';
import Sort from './../components/Sort/Sort.js';
import PizzaBlock from './../components/PizzaBlock/PizzaBlock.js';
import Skeleton from './../components/PizzaBlock/Skeleton.js';
import Pagination  from '../components/Pagination/Pagination.js';
import { SearchContext } from '../App.js';

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSearch = useRef(false);
    const isMounted = useRef(false);
    const {categoryId, sort, currentPage} = useSelector(state => state.filter);
    const sortType = sort.sortProperty;
    const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

    const onCangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const {searchValue} = useContext(SearchContext)
    const fetchPizzas = () => {
        setIsLoading(true)
        const category = categoryId > 0 ? `category=${categoryId}` : '';
        const sort = sortType.replace('-', '');
        const order = sortType.includes('-') ? 'desc' : 'asc';
        const search = searchValue ? `&search=${searchValue}` : '';
        const pagination = `page=${currentPage}`;
        axios
            .get(`https://65f82639b4f842e808870db2.mockapi.io/items?${pagination}&limit=4&${category}${search}&sortBy=${sort}&order=${order}`)
            .then(res => {
                setItems(res.data)
                setIsLoading(false)
            })
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
    }, [categoryId, sortType, currentPage])

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
		window.scrollTo(0, 0);
        if(!isSearch.current) {
            fetchPizzas()
        }
        isSearch.current = false;
	}, [categoryId, sortType, searchValue, currentPage])


   

    const onClickCategory = (i) => {
        dispatch(setCategoryId(i))
    }

   

    let pizzas = items
    // .filter(obj => {
    //     if(obj.name.toLowerCase().includes(searchValue.toLowerCase())) {
    //         return true;
    //     }
    //         return false
    // })
    .map((obj) => (<PizzaBlock key={obj.id} {...obj}/>));
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/> ) 
    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={(id) => onClickCategory(id)}/>
                <Sort />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
                {
                    isLoading ? skeletons : pizzas
                }
            </div>
            <Pagination currentPage={currentPage} onChangePage={onCangePage} />
        </div>
    )
}
export default Home;